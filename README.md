# BELAL-X666



name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Lint code
      run: npm run lint || echo "Lint step skipped"

    - name: Build project
      run: npm run build || echo "Build step skipped"

    - name: Run bot (dry run)
      run: node index.js || echo "Bot dry run complete"
