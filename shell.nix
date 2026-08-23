{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = [
    pkgs.git
    pkgs.nodejs_20 # Node.js for npm and compile.js
    (pkgs.python3.withPackages (ps:
      with ps; [
        mkdocs
        mkdocs-material
        pillow # Required for mkdocs-material[imaging]
        cairosvg # Required for mkdocs-material[imaging]
      ]))
  ];

  shellHook = ''
    echo "Setting up environment for NodeBB documentation..."

    # Create symbolic link only if it doesn't exist
    if [ ! -e docs ]; then
      ln -sf ./src/docs docs
      echo "Created symbolic link: docs -> src/docs"
    else
      echo "Symbolic link 'docs' already exists or is not needed, skipping"
    fi

    # Run npm install if node_modules is missing
    if [ ! -d node_modules ]; then
      npm install
      echo "Node.js dependencies installed"
    else
      echo "Node.js dependencies already installed, skipping"
    fi

    # Run the compile script
    node src/compile.js && echo "Compilation completed successfully" || {
      echo "Error: Compilation failed"
      exit 1
    }

    echo "Environment ready. Run 'mkdocs serve' to preview the documentation or 'mkdocs build' to generate the static site."
  '';
}
