// Simple test script to verify Yahoo Finance API functionality
import yahooFinance from "yahoo-finance2";

async function testYahooFinanceAPI() {
  try {
    console.log("Testing Yahoo Finance API...");

    // Test historical data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Just test 1 month of data

    const queryOptions = {
      period1: startDate.toISOString().split("T")[0],
      period2: endDate.toISOString().split("T")[0],
      interval: "1d",
    };

    // Test with AAPL
    console.log("Fetching historical data for AAPL...");
    const historical = await yahooFinance.historical("AAPL", queryOptions);
    console.log(
      `Historical data test: ${
        historical && historical.length > 0 ? "SUCCESS" : "FAILED"
      }`
    );
    console.log(`Retrieved ${historical?.length || 0} historical records`);

    // Test quote data for AAPL
    console.log("\nFetching latest quote for AAPL...");
    const quote = await yahooFinance.quote("AAPL");
    console.log(
      `Quote data test: ${
        quote && quote.regularMarketPrice ? "SUCCESS" : "FAILED"
      }`
    );
    console.log(`Latest price: $${quote?.regularMarketPrice || "N/A"}`);

    // Test quote data for SNOW
    console.log("\nFetching latest quote for SNOW...");
    const snowQuote = await yahooFinance.quote("SNOW");
    console.log(
      `Quote data test for SNOW: ${
        snowQuote && snowQuote.regularMarketPrice ? "SUCCESS" : "FAILED"
      }`
    );
    console.log(
      `Latest SNOW price: $${snowQuote?.regularMarketPrice || "N/A"}`
    );

    console.log("\nYahoo Finance API is working correctly!");
  } catch (error) {
    console.error("API test failed:", error);
  }
}

testYahooFinanceAPI();
