#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}"/../.. 1>/dev/null 2>&1)" && pwd )"

ISTANBUL="$DIR/node_modules/istanbul/lib/cli.js"
GRUNT="$DIR/node_modules/.bin/grunt"

CI_MODE=0

if [ "$1" == "-ci" ]
then
    CI_MODE=1
fi

if [ -d "$DIR/build/reports/code-coverage" ]
then
    rm -rf "$DIR/build/reports/code-coverage"
fi

echo $DIR/coverage

if [ -d "$DIR/coverage" ]
then
    rm -rf "$DIR/coverage"
fi

if [ ! -d "$DIR/build/logs" ]
then
    mkdir -p "$DIR/build/logs"
fi

if [ ! -d "$DIR/build/reports/code-coverage" ]
then
    mkdir -p "$DIR/build/reports/code-coverage"
fi

mkdir -p "$DIR/coverage/app"
mkdir -p "$DIR/coverage/out"

"$ISTANBUL" instrument --no-compact --complete-copy -o "$DIR/coverage/app/scripts" "$DIR/app/scripts"

ln -sf "$DIR/app/vendor" "$DIR/coverage/app/vendor"

"$GRUNT" test:coverage:process

if [ "$CI_MODE" == "0" ]
then
    "$ISTANBUL" report html --root "$DIR/coverage/out" --dir "$DIR/build/reports/code-coverage/"
    open "$DIR/build/reports/code-coverage/index.html"
else
    "$ISTANBUL" report cobertura --root "$DIR/coverage/out/" --dir "$DIR/coverage/report" -v
    mv "$DIR/coverage/report/cobertura-coverage.xml" "$DIR/build/logs/cobertura-coverage.xml"
fi

#rm -rf "$DIR/coverage"
