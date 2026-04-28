VENV := .venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
MKDOCS := $(VENV)/bin/mkdocs

.PHONY: install serve build clean

install: $(VENV)/bin/mkdocs

$(VENV)/bin/mkdocs: requirements.txt
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip -q
	$(PIP) install -r requirements.txt -q
	@echo "mkdocs installed in $(VENV)"

serve: install
	$(MKDOCS) serve

build: install
	$(MKDOCS) build

clean:
	rm -rf $(VENV) site/
