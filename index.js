var downloadUrl = require("download")
var gitclone = require("git-clone")
var rm = require("rimraf").sync

/**
 * Expose `download`.
 */

module.exports = download

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */

function download (repo, dest, opts, fn) {
  if (typeof opts === "function") {
    fn = opts
    opts = null
  }
  opts = opts || {}
  var clone = opts.clone || false
  var ssh = opts.ssh===undefined?true:opts.ssh;

  repo = normalize(repo)
  var url = getUrl(repo, clone, ssh)

  if (clone) {
    gitclone(url, dest, { checkout: repo.checkout }, function (err) {
      if (err === undefined) {
        rm(dest + "/.git")
        fn()
      }
      else {
        fn(err)
      }
    })
  }
  else {
    downloadUrl(url, dest, { extract: true, strip: 1, mode: "666", headers: { accept: "application/zip" } }).then(data => {
      fn()
    }).catch(err => {
      fn(err)
    })
  }
}

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */

function normalize (repo) {
  var regex = /^((github|gitlab|bitbucket):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$/
  var match = regex.exec(repo)
  var type = match[2] || "github"
  var origin = match[4] || null
  var owner = match[5]
  var name = match[6]
  var checkout = match[8] || "master"

  if (origin == null) {
    if (type === "github")
      origin = "github.com"
    else if (type === "gitlab")
      origin = "gitlab.com"
    else if (type === "bitbucket")
      origin = "bitbucket.com"
  }

  return {
    type: type,
    origin: origin,
    owner: owner,
    name: name,
    checkout: checkout
  }
}

/**
 * Add HTTPs protocol to url in none specified.
 *
 * @param {String} url
 * @return {String}
 */

function addProtocol (url, ssh) {
  if (!/^(f|ht)tps?:\/\//i.test(url)){
    if (ssh)
      url = "git@" + url
    else
      url = "https://" + url
  }
  
  // Add trailing slash or colon (for ssh)
  if (/^git\@/i.test(url))
    url = url + ":"
  else
    url = url + "/"

  return url
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl (repo, clone, ssh) {
  var url

  if (repo.type === "github")
    url = github(repo, clone, ssh)
  else if (repo.type === "gitlab")
    url = gitlab(repo, clone, ssh)
  else if (repo.type === "bitbucket")
    url = bitbucket(repo, clone, ssh)
  else
    url = github(repo, clone)

  return url
}

/**
 * Return a GitHub url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function github (repo, clone, ssh) {
  var url

  if (clone)
    url = addProtocol(repo.origin, ssh) + repo.owner + "/" + repo.name + ".git"
  else
    url = addProtocol(repo.origin) + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip"

  return url
}

/**
 * Return a GitLab url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function gitlab (repo, clone, ssh) {
  var url

  if (clone)
    url = addProtocol(repo.origin, ssh) + repo.owner + "/" + repo.name + ".git"
  else
    url = addProtocol(repo.origin) + repo.owner + "/" + repo.name + "/repository/archive.zip?ref=" + repo.checkout
  
  return url
}

/**
 * Return a Bitbucket url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function bitbucket (repo, clone, ssh) {
  var url

  if (clone)
    url = addProtocol(repo.origin, ssh) + repo.owner + "/" + repo.name + ".git"
  else
    url = addProtocol(repo.origin) + repo.owner + "/" + repo.name + "/get/" + repo.checkout + ".zip"

  return url
}
