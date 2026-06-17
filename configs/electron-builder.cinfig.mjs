

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: "justom-way",
  asar: true,
  productName:"及时通",
  directories: {
    output: "release/${version}"
  },
  publish: [
    {
      "provider": "generic",
      "url": "https://www.port56.cn/Releases/${os}"
    }
  ],
  files: [
    "!node_modules",
    "node_modules/axios",
    "node_modules/ws",
    "node_modules/follow-redirects",
    "node_modules/@electron",
    "dist",
    "package.json",
    "build"
  ],
  mac: {
    'icon': 'build/icons.png',
    artifactName: "${productName}_${version}.${ext}",
    target: [
      "dmg"
    ],
    target:{
      target:"default",
      arch:[
        // "x64",
        // "arm64",
        "universal"
      ]
    }
  },
  win: {
    'icon': 'build/icons.png',
    requestedExecutionLevel:"requireAdministrator",
    target: [
      {
        target: "nsis",
        arch: [
          "x64"
        ]
      }
    ],
    artifactName: "${productName}_${version}.${ext}"
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true
  }
}

export { config }
