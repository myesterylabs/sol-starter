const axios = require('axios')
const fs = require('fs')
const os = require('os')
const { promisify } = require('util')
const streamPipeline = promisify(require('stream').pipeline)

const SOLANA_DOWNLOAD_ROOT = 'https://release.solana.com'
const GH_LATEST_RELEASE = 'https://api.github.com/repos/solana-labs/solana/releases/latest'

async function downloadFile(url, outputPath) {
  const { data, headers } = await axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })

  const totalLength = headers['content-length']
  let downloadedLength = 0

  data.on('data', (chunk) => {
    downloadedLength += chunk.length
    console.log('Downloading...', ((downloadedLength / totalLength) * 100).toFixed(2) + '%')
  })

  await streamPipeline(data, fs.createWriteStream(outputPath))
}

async function main() {
  let _ostype = os.platform() // 'darwin', 'linux', 'win32'
  let _cputype = os.arch() // 'arm', 'arm64', 'x64', etc.

  switch (_ostype) {
    case 'linux':
      _ostype = 'unknown-linux-gnu'
      break
    case 'darwin':
      _ostype = 'apple-darwin'
      _cputype = _cputype === 'arm64' ? 'aarch64' : _cputype
      break
    default:
      throw new Error('Machine architecture is currently unsupported')
  }

  const TARGET = `${_cputype}-${_ostype}`

  const tempDir = fs.mkdtempSync('/tmp/solana-install-init')
  console.log(tempDir)
  let release

  if (process.env.SOLANA_RELEASE) {
    release = process.env.SOLANA_RELEASE
  } else {
    const response = await axios.get(GH_LATEST_RELEASE)
    release = response.data.tag_name
  }

  const downloadUrl = `${SOLANA_DOWNLOAD_ROOT}/${release}/solana-install-init-${TARGET}`
  console.log(downloadUrl)
  const solanaInstallInit = `${tempDir}/solana-install-init`

  console.log(`Downloading ${release} installer`)
  await downloadFile(downloadUrl, solanaInstallInit)

  // Additional logic for chmod, executing the installer, etc. goes here.

  console.log(`Downloaded to ${solanaInstallInit}`)
}

main().catch((err) => console.error('Error:', err))
