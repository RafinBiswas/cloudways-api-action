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
- `CLOUDWAYS_API_VERSION`     - Optional - Default is "v1"
- `CLOUDWAYS_API_PATH`
- `CLOUDWAYS_REQUEST_METHOD`  - Optional - Default is "POST"
- `CLOUDWAYS_REQUEST_BODY`    - Optional - Default is ""
- `CLOUDWAYS_TOKEN_REQUIRED`  - Optional - Default is "true"
- `CLOUDWAYS_REQUEST_RESPONSE`- Optional - Default is ""
- `CLOUDWAYS_PREFIX`          - Optional - Default is "cw_"

Follow the exact secrets names in your Workflow file, so you can identify those quickly.

[GitHub Secrets are set in your repository settings](https://docs.github.com/es/actions/reference/encrypted-secrets).

## Action Inputs

You must provide all of these inputs except optional inputs in your Workflow file.

- `email`           - Cloudways account email
- `api-key`         - Cloudways API key
- `api-version`     - Cloudways API version(Ex: v1) (**Optional**)
- `api-path`        - Cloudways API path(Ex: /cloudways/path)
- `request-method`  - Cloudways API request method(GET or POST or PUT or DELETE) (**Optional**)
- `request-body`    - Cloudways API request body(EX: key:value, key.index:value) multiline supported (**Optional**)
- `token-required`  - Cloudways API request token required? (**Optional**)
- `request-response`- Cloudways API request response(EX: key:value, key.index:value) multiline supported (**Optional**)
- `prefix`          - Action prefix to ensure unique step (**Optional**)

> Saved export variable name is "${{ secrets.CLOUDWAYS_PREFIX }}${{ secrets.CLOUDWAYS_REQUEST_RESPONSE }}"
> Ex: cw_data. To access the value use ${{ env.cw_data }}.

## Usage

To get started, you might want to copy the content of the next example into `.github/workflows/cloudways-deploy.yml` and push that file to your repository.

In the example, the action will start when you create and push a new tag. [You can change that behavior](https://docs.github.com/en/actions/reference/events-that-trigger-workflows), for example, when you create a release or a simple push to your `main` branch.

```yaml
name: Cloudways API Execute Via Git Action

on:
  push:
    branches:
      - 'feature-**'
      - 'feature/**'
  pull_request:
    branches:
      - 'main'
      - 'stage'
    types:
      - closed

jobs:
  cloudways-deployment:
    name: Cloudways Deploymen

    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Cloudways API Git Action
        uses: RafinBiswas/cloudways-api-action@stable
        with:
          email: ${{ secrets.CLOUDWAYS_EMAIL }}
          api-key: ${{ secrets.CLOUDWAYS_API_KEY }}
          api-version: ${{ secrets.CLOUDWAYS_API_VERSION }}
          api-path: ${{ secrets.CLOUDWAYS_API_PATH }}
          request-method: ${{ secrets.CLOUDWAYS_REQUEST_METHOD }}
          request-body: |
            ${{ secrets.CLOUDWAYS_REQUEST_BODY }}
          token-required: ${{ secrets.CLOUDWAYS_TOKEN_REQUIRED }}
          request-response: |
            ${{ secrets.CLOUDWAYS_REQUEST_RESPONSE }}
          prefix: ${{ secrets.CLOUDWAYS_PREFIX }}

      - name: Get Cloudways Server SFTP Whitelisted IPs
        uses: RafinBiswas/cloudways-api-action@stable
        with:
          email: ${{ secrets.CLOUDWAYS_EMAIL }}
          api-key: ${{ secrets.CLOUDWAYS_API_KEY }}
          api-path: "/security/whitelisted"
          request-method: "GET"
          request-body: |
            server_id:${{ secrets.CLOUDWAYS_SERVER_ID }}
          request-response: |
            data.ip_list:[]
          prefix: "cwsl_"

      - name: Set Cloudways Server SFTP Whitelisted IPs
        uses: RafinBiswas/cloudways-api-action@stable
        with:
          email: ${{ secrets.CLOUDWAYS_EMAIL }}
          api-key: ${{ secrets.CLOUDWAYS_API_KEY }}
          api-path: "/security/whitelisted"
          request-body: |
            server_id:${{ secrets.CLOUDWAYS_SERVER_ID }}
            tab:sftp
            ip:${{ env.cwsl_data_ip_list }}
            type:sftp
            ipPolicy:block_all

```

## License

This GitHub Action is available for use and remix under the MIT license.
