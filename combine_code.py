import os

# Define the output file name
OUTPUT_FILE = "combined_frontend_code.txt"

# List of file extensions to include
INCLUDED_EXTENSIONS = [".html", ".js", ".css"]

def should_include(filepath):
    """Check if a file should be included based on its extension."""
    # Include only specified extensions
    return os.path.splitext(filepath)[1].lower() in INCLUDED_EXTENSIONS

def combine_code():
    with open(OUTPUT_FILE, "w") as output_file:
        for root, _, files in os.walk("."):  # Walk through all files and folders
            for filename in sorted(files):
                filepath = os.path.join(root, filename)
                if should_include(filepath):  # Include only .html, .js, .css files
                    add_file_to_output(filepath, output_file)
    print(f"Combined code saved to {OUTPUT_FILE}")

def add_file_to_output(filepath, output_file):
    """Add the content of a file to the output file with a labeled header."""
    try:
        with open(filepath, "r") as f:
            content = f.read()
        relative_path = os.path.relpath(filepath)
        header = f"\n##### {relative_path} #####\n"
        output_file.write(header + content + "\n")
    except Exception as e:
        print(f"Skipped {filepath} due to an error: {e}")

if __name__ == "__main__":
    combine_code()
