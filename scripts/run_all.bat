@echo off
cd /d "%~dp0.."
set PYTHONPATH=%CD%
python scripts\run_experiments.py
