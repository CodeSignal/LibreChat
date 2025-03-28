#!/bin/sh

func_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$child" 2>/dev/null
}
trap func_term SIGTERM

npm run backend &

npm run create-user cosmo@example.com Cosmo Cosmo W3LoveCosmo -- --email-verified=y

child=$!
wait "$child"
