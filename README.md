Markdown Preview
============

This is a basic tool for previewing Github-flavored markdown.

## Motivation
I somehow always end up authoring Markdown files when I have no internet connectivity. I wanted a tool that I could use to easily preview text while on an airplane.

## Architecture
The tool consists of a server that serves up static files and converts Markdown text posted to the /api/render endpoint. The HTML and Javascript just look for pauses in user input and send the text to the server for conversion. The server uses robotskirt node module, so that we can render language-specific code blocks and whatnot.

The idea is to run this locally when necessary.

