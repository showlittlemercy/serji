import subprocess
from pathlib import Path

repo = Path(r"c:\Users\priyanshu\Desktop\ALL Files\MY PROJECTS\AI PROJECTS\serji")
git = r"C:\Program Files\Git\cmd\git.exe"
msg = "Improve monthly background animations for light and dark visibility"


def run(*args: str) -> str:
    return subprocess.run(
        [git, *args],
        cwd=repo,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()


run("add", "-A")
# Ensure .env never staged
status = run("status", "--short")
if any(line.endswith(" .env") or line.endswith("\t.env") for line in status.splitlines()):
    run("reset", "HEAD", "--", ".env")

tree = run("write-tree")
parent = run("rev-parse", "HEAD")
new = subprocess.run(
    [git, "commit-tree", tree, "-p", parent, "-m", msg],
    cwd=repo,
    capture_output=True,
    text=True,
    check=True,
).stdout.strip()
run("reset", "--hard", new)
print(run("log", "-1", "--oneline"))
print(run("status", "--short"))
