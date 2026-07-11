

timestamp=$(date "+%Y-%m-%d %H:%M:%S")
msg="commit at ($timestamp)"
git add .
git commit -m "($msg)"
git push
