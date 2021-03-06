# download-git-repo

Download or Clone (ssh or https) and extract a git repository (GitHub, GitLab, Bitbucket) from node.

## API

### download(repository, destination, options, callback)

Download a git `repository` to a `destination` folder with `options`, and `callback`.

#### repository
The short hand repository string to download the repository from:

- GitHub - `github:owner/name` or simply `owner/name`
- GitLab - `gitlab:owner/name`
- Bitbucket - `bitbucket:owner/name`

The `repository` parameter defaults to the `master` branch, but you can specify a branch or tag as a URL fragment like `owner/name#my-branch`.
In addition to specifying the type of where to download, you can also specify a custom origin like `gitlab:custom.com:owner/name`.
Custom origin will default to HTTPS unless protocol is specified.
Feel free to submit an issue or pull request for additional origin options.

#### destination
The file path to download the repository to.

#### options
An optional options object parameter with download options. Options include:

- `clone` - boolean default `false` - If true use `git clone` instead of an http download. While this can be a bit slower, it does allow private repositories to be used if the appropriate SSH keys are setup.

#### callback
The callback function as `function (err)`.

## Examples
Using http download from Github repository at master.
```javascript
download('egermano/download-git-repo-fixture', 'test/tmp', function (err) {
  console.log(err ? "Error" : "Success")
})
```

Using git clone from Bitbucket repository at my-branch.
```javascript
download('bitbucket:egermano/download-git-repo-fixture#ssh-option', 'test/tmp', {clone: true, ssh: true}, function (err) {
  console.log(err ? "Error" : "Success")
})
```

## Thanks

To [ianstormtaylor/download-github-repo](https://github.com/ianstormtaylor/download-github-repo) for the head start.

## License

MIT
