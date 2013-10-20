#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."

ISTANBUL=$DIR/node_modules/istanbul/lib/cli.js
GRUNT=$DIR/node_modules/.bin/grunt

CI_MODE=0

if [ "$1" == "-ci" ]
then
    CI_MODE=1
fi

if [ -d build/reports/code-coverage ]
then
    rm -rf build/reports/code-coverage
fi

if [ -d coverage ]
then
    rm -rf "$DIR/coverage"
fi

if [ ! -d build/logs ]
then
    mkdir -p build/logs
fi

if [ ! -d build/reports/code-coverage ]
then
    mkdir -p build/reports/code-coverage
fi

mkdir -p "$DIR/coverage/app"
mkdir -p "$DIR/coverage/out"

$ISTANBUL instrument --no-compact --complete-copy -o "$DIR/coverage/app/scripts" app/scripts

ln -sf "$DIR/app/vendor" "$DIR/coverage/app/vendor"

$GRUNT test:coverage:process

if [ "$CI_MODE" == "0" ]
then
    $ISTANBUL report html --root coverage/out --dir build/reports/code-coverage/
    open build/reports/code-coverage/index.html
else
    $ISTANBUL report cobertura --root coverage/out/ --dir coverage/report -v
    mv coverage/report/cobertura-coverage.xml build/logs/cobertura-coverage.xml
fi

rm -rf "$DIR/coverage"

