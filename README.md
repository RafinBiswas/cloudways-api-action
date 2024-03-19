# Cloudways API Action

Cloudways API GitHub action package. This GitHub action allows you to use all [Cloudways APIs](https://developers.cloudways.com/).

## Configuration

To use this GitHub Action you need:

1. Cloudways account.
2. Cloudways API Key.
3. Cloudways' data stored in your GitHub repository secrets.

Cloudways provides you an easy way to [get it in its own platform](https://platform.cloudways.com/api) or [read this guide about how to generate it](https://support.cloudways.com/en/articles/5136065-how-to-use-the-cloudways-api).

Also, you can read this guide to know [how to set up your Deployment Via Git functionality in Cloudways](https://support.cloudways.com/en/articles/5124087-deploy-code-to-your-application-using-git).

## Secrets

You can specify the Cloudways' data right into your Workflow file but **that is not recommended for security reasons**.

Instead, you must use GitHub Secrets for your repository with the following names:

- `CLOUDWAYS_EMAIL`
- `CLOUDWAYS_API_KEY`
- `CLOUDWAYS_API_VERSION`     - Optional
- `CLOUDWAYS_API_PATH`
- `CLOUDWAYS_REQUEST_METHOD`  - Optional
- `CLOUDWAYS_REQUEST_BODY`    - Optional
- `CLOUDWAYS_TOKEN_REQUIRED`  - Optional

Follow the exact secrets names in your Workflow file, so you can identify those quickly.

[GitHub Secrets are set in your repository settings](https://docs.github.com/es/actions/reference/encrypted-secrets).

## Required Inputs

You must provide all of these inputs in your Workflow file.

- `email`           - Cloudways account email
- `api-key`         - Cloudways API key
- `api-version`     - Cloudways API version(Ex: v1)
- `api-path`        - Cloudways API path(Ex: /cloudways/path)
- `request-method`  - Cloudways API request method(GET or POST or PUT or DELETE)
- `request-body`    - Cloudways API request body(EX: key:value) multiline supported
- `token-required`  - Cloudways API request token required?

## Usage

To get started, you might want to copy the content of the next example into `.github/workflows/cloudways-deploy.yml` and push that file to your repository.

In the example, the action will start when you create and push a new tag. [You can change that behavior](https://docs.github.com/en/actions/reference/events-that-trigger-workflows), for example, when you create a release or a simple push to your `main` branch.

```yaml
name: Cloudways API Execute Via Git Action

on:
  push:
    tags:
      - "*"

jobs:
  tag:
    name: New Tag

    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Cloudways API Git Action
        uses: roelmagdaleno/cloudways-api-git-pull-action@stable
        with:
          email: ${{ secrets.CLOUDWAYS_EMAIL }}
          api-key: ${{ secrets.CLOUDWAYS_API_KEY }}
          api-version: ${{ secrets.CLOUDWAYS_API_VERSION }}
          api-path: ${{ secrets.CLOUDWAYS_API_PATH }}
          request-method: ${{ secrets.CLOUDWAYS_REQUEST_METHOD }}
          request-body: ${{ secrets.CLOUDWAYS_REQUEST_BODY }}
          token-required: ${{ secrets.CLOUDWAYS_TOKEN_REQUIRED }}
```

## License

This GitHub Action is available for use and remix under the MIT license.
