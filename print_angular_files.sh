#!/bin/bash

# Set the base directory to the current directory
BASE_DIR="."

# Set the output file
OUTPUT_FILE="angular_project_files.txt"

# Function to print file contents with a header
print_file_contents() {
    echo "=======================================" >> "$OUTPUT_FILE"
    echo "File: $1" >> "$OUTPUT_FILE"
    echo "=======================================" >> "$OUTPUT_FILE"
    cat "$1" >> "$OUTPUT_FILE"
    echo -e "\n\n" >> "$OUTPUT_FILE"
}

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Print package.json
print_file_contents "package.json"

# Print angular.json
print_file_contents "angular.json"

# Print tsconfig.json
print_file_contents "tsconfig.json"

# Print main.ts
print_file_contents "src/main.ts"

# Print app.module.ts
print_file_contents "src/app/app.module.ts"

# Print app-routing.module.ts if it exists
if [ -f "src/app/app-routing.module.ts" ]; then
    print_file_contents "src/app/app-routing.module.ts"
fi

# Function to print contents of all files in a directory
print_directory_contents() {
    find "$1" -type f \( -name "*.ts" -o -name "*.html" -o -name "*.css" -o -name "*.scss" \) | while read -r file; do
        print_file_contents "${file#./}"
    done
}

# Print contents of all files in the components directory
print_directory_contents "src/app"

echo "File contents have been written to $OUTPUT_FILE"
