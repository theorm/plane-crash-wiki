# Plane crash wiki server

## Build

```shell
  make build
```

## Run

```shell
  make run
```


## Design notes

File changes is monitored using `fs.watch` function. Ideally a new update should post a message to an event queue from where all the processes would read it and reload the file (or rather read file text and revision from the message).Redis or RabbitMQ will do.


Article update endpoint is now in every process. Ideally it should be in a separate process. The number of "update api" processes could be scaled when needed.

Revision is calculated as a hash of the text. A faster option would be to store revision as an incrementable number somewhere.

When a user is trying to update a version of the article that was already updated by someone else, his request is rejected. Something smarter like git merge resolution mechanism could be implemented to let the user update the article if the part of it that he is changing was not affected by previous updates.

