#!bash
for pj in $(find . -type f -name package.json | grep -v node_modules);do
  d=$(dirname $pj); (
    echo "Fixing $d ...";
    cd $d;
    rm -rf node_modules package-lock.json;
    npm install --no-optional;
    unix2dos package*.json;
  );
done
