# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js <RepoOwner> <RepoName> `

Example:
`node download_avatars.js jquery jquery`

## Possible errors that are caught

Will throw an error if either RepoOwner or RepoName are not entered.

Will throw an error if the RepoOwner/RepoName request does not return with a response code of 200. IE, it does not exist.