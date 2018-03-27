git pull
cp -r ./src/docs/** ./docs
node src/compile
mkdocs build
