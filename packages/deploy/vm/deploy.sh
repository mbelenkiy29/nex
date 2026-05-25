#!/bin/bash

# Deployment Script
# Usage: ./deploy.sh [environment] [options]

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
PLAYBOOK="playbook.yml"
ANSIBLE_ARGS=""
CHECK_MODE=false
TAGS=""
SKIP_TAGS=""

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
    echo "  production    Deploy to production servers (default)"
    echo "  staging       Deploy to staging servers"
    echo ""
    echo "Options:"
    echo "  -c, --check          Run in check mode (dry run)"
    echo "  -t, --tags TAGS      Only run plays and tasks tagged with these values"
    echo "  -s, --skip TAGS      Skip plays and tasks tagged with these values"
    echo "  -l, --limit PATTERN  Limit selected hosts to this pattern"
    echo "  -v, --verbose        Verbose mode (-vvv for more)"
    echo "  -h, --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                   # Deploy to production"
    echo "  $0 staging           # Deploy to staging"
    echo "  $0 production -c     # Dry run for production"
    echo "  $0 -t app            # Deploy only app components"
    echo "  $0 -l server1        # Deploy only to server1"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        production|staging)
            ENVIRONMENT=$1
            shift
            ;;
        -c|--check)
            CHECK_MODE=true
            ANSIBLE_ARGS="${ANSIBLE_ARGS} --check"
            shift
            ;;
        -t|--tags)
            TAGS=$2
            ANSIBLE_ARGS="${ANSIBLE_ARGS} --tags ${TAGS}"
            shift 2
            ;;
        -s|--skip)
            SKIP_TAGS=$2
            ANSIBLE_ARGS="${ANSIBLE_ARGS} --skip-tags ${SKIP_TAGS}"
            shift 2
            ;;
        -l|--limit)
            LIMIT=$2
            ANSIBLE_ARGS="${ANSIBLE_ARGS} --limit ${LIMIT}"
            shift 2
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

# Check if secrets file exists
if [ ! -f "group_vars/secrets.yml" ]; then
    print_color $YELLOW "Warning: secrets.yml not found!"
    print_color $YELLOW "Copy group_vars/secrets.yml.example to group_vars/secrets.yml and configure it."
    read -p "Do you want to continue without secrets.yml? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
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

# Check for uncommitted git changes
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    print_color $YELLOW "Warning: You have uncommitted git changes!"
    git status --short
    echo ""
    read -p "Do you want to continue with uncommitted changes? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_color $YELLOW "Deployment cancelled. Please commit or stash your changes."
        exit 0
    fi
fi

# Display deployment information
print_color $GREEN "======================================"
print_color $GREEN "Deployment"
print_color $GREEN "======================================"
print_color $YELLOW "Environment: ${ENVIRONMENT}"
print_color $YELLOW "Inventory: ${INVENTORY}"
if [ "$CHECK_MODE" = true ]; then
    print_color $YELLOW "Mode: CHECK MODE (Dry Run)"
fi
if [ ! -z "$TAGS" ]; then
    print_color $YELLOW "Tags: ${TAGS}"
fi
if [ ! -z "$SKIP_TAGS" ]; then
    print_color $YELLOW "Skip Tags: ${SKIP_TAGS}"
fi
print_color $GREEN "======================================"

# Run Ansible playbook
print_color $GREEN "Starting deployment..."
ansible-playbook -i ${INVENTORY} ${PLAYBOOK} ${ANSIBLE_ARGS}

# Check exit status
if [ $? -eq 0 ]; then
    print_color $GREEN "======================================"
    print_color $GREEN "Deployment completed successfully!"
    print_color $GREEN "======================================"
else
    print_color $RED "======================================"
    print_color $RED "Deployment failed!"
    print_color $RED "======================================"
    exit 1
fi