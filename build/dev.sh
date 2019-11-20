DIST_PATH="dist"

function start {
  node $DIST_PATH/main.js
}

# first start
if [ ! -x $DIST_PATH ]; then
  # build 
  tsc;
  start;
else
  start;
fi

