
class ExchangeAdapter {
  async validateCredentials() {
    throw new Error("validateCredentials() must be implemented");
  }

  async getAccountInfo() {
    throw new Error("getAccountInfo() must be implemented");
  }

  async getBalances() {
    throw new Error("getBalances() must be implemented");
  }

  async getSymbols() {
    throw new Error("getSymbols() must be implemented");
  }
}

export default ExchangeAdapter;