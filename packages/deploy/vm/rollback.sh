#!/bin/bash

# Rollback Script
# Usage: ./rollback.sh [environment] [options]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
PLAYBOOK="rollback.yml"
ANSIBLE_ARGS=""

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print usage
usage() {
    echo "Usage: $0 [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  production    Rollback production servers (default)"
    echo "  staging       Rollback staging servers"
    echo ""
    echo "Options:"
    echo "  -v, --verbose        Verbose mode (-vvv for more)"
    echo "  -h, --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                   # Rollback production"
    echo "  $0 staging           # Rollback staging"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        production|staging)
            ENVIRONMENT=$1
            shift
            ;;
        -v|--verbose)
            ANSIBLE_ARGS="${ANSIBLE_ARGS} -v"
            shift
            ;;
        -vv)
            ANSIBLE_ARGS="${ANSIBLE_ARGS} -vv"
            shift
            ;;
        -vvv)
            ANSIBLE_ARGS="${ANSIBLE_ARGS} -vvv"
            shift
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

# Set inventory file based on environment
INVENTORY="inventories/${ENVIRONMENT}.ini"

# Check if inventory file exists
if [ ! -f "$INVENTORY" ]; then
    print_color $RED "Error: Inventory file $INVENTORY not found!"
    exit 1
fi

# Check for required commands
command -v ansible-playbook >/dev/null 2>&1 || {
    print_color $RED "Error: ansible-playbook is not installed!"
    echo "Install Ansible with:"
    echo "  macOS:         brew install ansible"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install ansible"
    echo "  Other Linux:   pipx install --include-deps ansible"
    exit 1
}

# Display rollback information
print_color $GREEN "======================================"
print_color $GREEN "Rollback"
print_color $GREEN "======================================"
print_color $YELLOW "Environment: ${ENVIRONMENT}"
print_color $YELLOW "Inventory: ${INVENTORY}"
print_color $RED "This will switch to the previous deployment!"
print_color $GREEN "======================================"

# Run Ansible playbook
print_color $GREEN "Starting rollback..."
ansible-playbook -i ${INVENTORY} ${PLAYBOOK} ${ANSIBLE_ARGS}

# Check exit status
if [ $? -eq 0 ]; then
    print_color $GREEN "======================================"
    print_color $GREEN "Rollback completed successfully!"
    print_color $GREEN "======================================"
else
    print_color $RED "======================================"
    print_color $RED "Rollback failed!"
    print_color $RED "======================================"
    exit 1
fi
