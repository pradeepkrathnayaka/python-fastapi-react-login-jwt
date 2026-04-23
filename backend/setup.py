from setuptools import setup, find_packages

setup(
    name="fastapi-jwt-auth",
    version="1.0.0",
    packages=find_packages(include=["src", "src.*"]),
    python_requires=">=3.11",
)
