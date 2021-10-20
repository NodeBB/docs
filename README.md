# NodeBB Documentation Portal

This repository houses the content and source code for the [documentation portal](//docs.nodebb.org).

## Contributing

The primary method of contributing is by [making a pull request](https://github.com/NodeBB/docs/pulls). You can either edit the source code directly in GitHub (which would automatically fork the repository into your own account), or by cloning a local copy and forking the repository manually.

Documentation is written in Markdown. While Markdown supports HTML, we encourage the _minimal use of HTML_ so as to ensure that all documentation is of similar style.

If there are insufficient articles or incorrect information, please [file a new issue](https://github.com/NodeBB/docs/issues/new) against this repository. It will help us ensure that content is kept up to date.

When changes are committed or pull requests merged, the documentation portal will be updated automatically. If this is not the case, please open an issue for us to investigate.

## How to test your changes

If you want to take a look at how your changes look, you can run a local install of the documentation portal.

1. Install pip: `sudo apt-get update && sudo apt-get install python3-pip`
1. Install mkdocs: `pip3 install mkdocs` (you may need sudo for this, Windows users may need to run `python -m pip install mkdocs` instead)
1. Install the `material` theme: `pip3 install mkdocs-material`
1. From repo root, create a symbolic link pointing to `src/docs`: `ln -s ./src/docs`
1. Install dependencies: `yarn` or `npm`
1. Build templates: `node src/compile.js`
1. Start development mode: `mkdocs serve` (run this from the root of the checked out repository, `python -m mkdocs serve` for Windows)
1. Browse to `http://localhost:8000`

The page will automatically refresh every time any files are changed.

## Localisation

At this time we do not have plans to localise the NodeBB documentation.