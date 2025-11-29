import { HFVSDKConfig, defaultConfig } from './config'

export class HFVClient {
  readonly config: Required<HFVSDKConfig>

  constructor(userConfig: HFVSDKConfig = {}) {
    this.config = {
      ...defaultConfig,
      ...userConfig
    }
  }

  get apiBaseUrl() {
    return this.config.apiBaseUrl
  }

  get env() {
    return this.config.env
  }
}