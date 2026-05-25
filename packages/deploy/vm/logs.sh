#!/bin/bash

# Logs Script
# Usage: ./logs.sh [environment] [options]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
COMMAND=""
SERVICE=""
LINES=100
FOLLOW=false

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print usage
usage() {
    echo "Usage: $0 [environment] [command] [options]"
    echo ""
    echo "Environments:"
    echo "  production    View production server logs (default)"
    echo "  staging       View staging server logs"
    echo ""
    echo "Commands:"
    echo "  status        Show all service statuses"
    echo "  metrics       Show system metrics (CPU, memory, disk)"
    echo "  backend       Show backend service logs"
    echo "  frontend      Show frontend service logs"
    echo "  worker        Show worker service logs"
    echo "  caddy         Show Caddy web server logs"
    echo "  postgres      Show PostgreSQL logs"
    echo "  redis         Show Redis logs"
    echo "  system        Show system logs"
    echo "  all           Show all application logs"
    echo ""
    echo "Options:"
    echo "  -f, --follow         Follow log output (tail -f)"
    echo "  -n, --lines N        Number of lines to show (default: 100)"
    echo "  -s, --service NAME   Specific service (e.g., backend-blue)"
    echo "  -h, --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status                    # Show service status"
    echo "  $0 metrics                   # Show system metrics"
    echo "  $0 backend                   # Show backend logs"
    echo "  $0 backend -f                # Follow backend logs"
    echo "  $0 backend -s backend-blue   # Show only backend-blue logs"
    echo "  $0 all -n 50                 # Show last 50 lines of all logs"
    echo "  $0 staging worker -f         # Follow worker logs on staging"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        production|staging)
            ENVIRONMENT=$1
            shift
            ;;
        status|metrics|backend|frontend|worker|caddy|postgres|redis|system|all)
            COMMAND=$1
            shift
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n|--lines)
            LINES=$2
            shift 2
            ;;
        -s|--service)
            SERVICE=$2
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            print_color $RED "Unknown option: $1"
            usage
            ;;
    esac
done

# Default command
if [ -z "$COMMAND" ]; then
    COMMAND="status"
fi

# Set inventory file based on environment
INVENTORY="inventories/${ENVIRONMENT}.ini"

# Check if inventory file exists
if [ ! -f "$INVENTORY" ]; then
    print_color $RED "Error: Inventory file $INVENTORY not found!"
    exit 1
fi

# Get the first host from inventory
HOST_LINE=$(grep -v '^\[' "$INVENTORY" | grep -v '^$' | grep -v '^#' | grep 'ansible_host=' | head -n 1)

# Extract ansible_host (IP address)
HOST=$(echo "$HOST_LINE" | sed 's/.*ansible_host=\([^ ]*\).*/\1/')

# Extract ansible_user
SSH_USER=$(echo "$HOST_LINE" | sed 's/.*ansible_user=\([^ ]*\).*/\1/')

if [ -z "$HOST" ]; then
    print_color $RED "Error: No host found in inventory file!"
    exit 1
fi

if [ -z "$SSH_USER" ]; then
    SSH_USER="deploy"
fi

# Print header
print_color $CYAN "======================================"
print_color $CYAN "Server Logs - ${ENVIRONMENT}"
print_color $CYAN "======================================"
print_color $YELLOW "Host: ${HOST}"
print_color $YELLOW "User: ${SSH_USER}"
print_color $YELLOW "Command: ${COMMAND}"
print_color $CYAN "======================================"
echo ""

# Function to run SSH command
run_ssh() {
    ssh -o ConnectTimeout=10 "${SSH_USER}@${HOST}" "$1"
}

# Execute command based on selection
case $COMMAND in
    status)
        print_color $GREEN "=== Active Deployment Color ==="
        run_ssh "cat /opt/project/active_color 2>/dev/null || echo 'Not found'"
        echo ""

        print_color $GREEN "=== Service Status ==="
        run_ssh "systemctl status backend-blue backend-green frontend-blue frontend-green worker-blue worker-green caddy postgresql redis --no-pager" || true
        ;;

    metrics)
        print_color $GREEN "=== System Metrics ==="
        echo ""

        print_color $YELLOW "CPU and Load:"
        run_ssh "uptime"
        run_ssh "top -bn1 | head -n 5"
        echo ""

        print_color $YELLOW "Memory Usage:"
        run_ssh "free -h"
        echo ""

        print_color $YELLOW "Disk Usage:"
        run_ssh "df -h"
        echo ""

        print_color $YELLOW "Disk I/O:"
        run_ssh "iostat -x 1 2 | tail -n +4" || echo "iostat not available"
        echo ""

        print_color $YELLOW "Network Connections:"
        run_ssh "ss -s"
        echo ""

        print_color $YELLOW "Top Processes by Memory:"
        run_ssh "ps aux --sort=-%mem | head -n 11"
        echo ""

        print_color $YELLOW "Top Processes by CPU:"
        run_ssh "ps aux --sort=-%cpu | head -n 11"
        ;;

    backend)
        if [ -n "$SERVICE" ]; then
            print_color $GREEN "=== ${SERVICE} Logs ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u ${SERVICE} -f"
            else
                run_ssh "sudo journalctl -u ${SERVICE} -n ${LINES} --no-pager"
            fi
        else
            print_color $GREEN "=== Backend Logs (Blue & Green) ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u backend-blue -u backend-green -f"
            else
                run_ssh "sudo journalctl -u backend-blue -u backend-green -n ${LINES} --no-pager"
            fi
        fi
        ;;

    frontend)
        if [ -n "$SERVICE" ]; then
            print_color $GREEN "=== ${SERVICE} Logs ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u ${SERVICE} -f"
            else
                run_ssh "sudo journalctl -u ${SERVICE} -n ${LINES} --no-pager"
            fi
        else
            print_color $GREEN "=== Frontend Logs (Blue & Green) ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u frontend-blue -u frontend-green -f"
            else
                run_ssh "sudo journalctl -u frontend-blue -u frontend-green -n ${LINES} --no-pager"
            fi
        fi
        ;;

    worker)
        if [ -n "$SERVICE" ]; then
            print_color $GREEN "=== ${SERVICE} Logs ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u ${SERVICE} -f"
            else
                run_ssh "sudo journalctl -u ${SERVICE} -n ${LINES} --no-pager"
            fi
        else
            print_color $GREEN "=== Worker Logs (Blue & Green) ==="
            if [ "$FOLLOW" = true ]; then
                run_ssh "sudo journalctl -u worker-blue -u worker-green -f"
            else
                run_ssh "sudo journalctl -u worker-blue -u worker-green -n ${LINES} --no-pager"
            fi
        fi
        ;;

    caddy)
        print_color $GREEN "=== Caddy Logs ==="
        if [ "$FOLLOW" = true ]; then
            run_ssh "sudo journalctl -u caddy -f"
        else
            run_ssh "sudo journalctl -u caddy -n ${LINES} --no-pager"
        fi
        ;;

    postgres)
        print_color $GREEN "=== PostgreSQL Logs ==="
        if [ "$FOLLOW" = true ]; then
            run_ssh "sudo journalctl -u postgresql -f"
        else
            run_ssh "sudo journalctl -u postgresql -n ${LINES} --no-pager"
        fi
        echo ""
        print_color $YELLOW "PostgreSQL Slow Queries:"
        run_ssh "sudo tail -n 50 /var/log/postgresql/postgresql-*.log 2>/dev/null | grep -i 'duration:' | tail -n 20" || echo "No slow query logs found"
        ;;

    redis)
        print_color $GREEN "=== Redis Logs ==="
        if [ "$FOLLOW" = true ]; then
            run_ssh "sudo journalctl -u redis -f"
        else
            run_ssh "sudo journalctl -u redis -n ${LINES} --no-pager"
        fi
        echo ""
        print_color $YELLOW "Redis Info:"
        run_ssh "redis-cli info | grep -E '(used_memory_human|connected_clients|total_commands_processed|uptime_in_days)'" || echo "Could not connect to Redis"
        ;;

    system)
        print_color $GREEN "=== System Logs ==="
        if [ "$FOLLOW" = true ]; then
            run_ssh "sudo journalctl -p err -f"
        else
            run_ssh "sudo journalctl -p err -n ${LINES} --no-pager"
        fi
        echo ""
        print_color $YELLOW "Authentication Failures (fail2ban):"
        run_ssh "sudo journalctl -u fail2ban -n 20 --no-pager" || echo "fail2ban not available"
        ;;

    all)
        print_color $GREEN "=== All Application Logs ==="
        if [ "$FOLLOW" = true ]; then
            run_ssh "sudo journalctl -u backend-blue -u backend-green -u frontend-blue -u frontend-green -u worker-blue -u worker-green -u caddy -f"
        else
            run_ssh "sudo journalctl -u backend-blue -u backend-green -u frontend-blue -u frontend-green -u worker-blue -u worker-green -u caddy -n ${LINES} --no-pager"
        fi
        ;;

    *)
        print_color $RED "Unknown command: $COMMAND"
        usage
        ;;
esac

# Print footer
echo ""
print_color $CYAN "======================================"
print_color $GREEN "Complete!"
print_color $CYAN "======================================"
