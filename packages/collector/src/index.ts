#!/usr/bin/env node

import { Command, OptionValues } from 'commander';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { ICreateGoldPrice, ICreateGoldPriceList } from '@bdjs-project/api';

const program = new Command();


type GoldPrice = {
  date: string;
  price: number;
}

type NbpGoldPrice = {
  data: string;
  cena: number;
}

type NbpResponse = Array<NbpGoldPrice>


async function sendSingleGoldPriceToApi(goldPrice: ICreateGoldPrice): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/api/gold-prices/add/single', goldPrice);
    console.log(`Successfully sent single gold price to API: ${response.status}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.dir(error.response?.data, {depth: null});
      throw new Error(`Failed to send gold price to API: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

async function sendMultipleGoldPricesToApi(goldPrices: ICreateGoldPriceList): Promise<void> {
  try {
    const response = await axios.post('http://localhost:3000/api/gold-prices/add/list', goldPrices);
    console.log(`Successfully sent ${goldPrices.prices.length} gold prices to API: ${response.status}`);
  } catch (error) {

    if (axios.isAxiosError(error)) {
      console.dir(error.response?.data, {depth: null});
      throw new Error(`Failed to send gold prices to API: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

async function fetchGoldPrice(date: string): Promise<GoldPrice> {
  try {
    console.log('Fetching gold price for date:', date);
    const response = await axios.get<NbpResponse>(
      `https://api.nbp.pl/api/cenyzlota/${date}?format=json`
    );

    if (!response.data || response.data.length === 0) {
      throw new Error(`No gold price data available for date: ${date}`);
    }

    const goldPrice = response.data[0];
    return {
      date: goldPrice.data,
      price: goldPrice.cena
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`No gold price data available for date: ${date}`);
    }
    throw error;
  }
}

async function main() {
  program
    .name('collector')
    .option('-d, --dates <dates...>', 'Dates to fetch gold prices for (YYYY-MM-DD format)')
    .action(async (options: OptionValues) => {
      const dates = options.dates || [format(new Date(), 'yyyy-MM-dd')];

      try {
        const goldPrices: GoldPrice[] = [];
        for (const date of dates) {
          try {
            // Validate date format
            parseISO(date);
            
            const goldPrice = await fetchGoldPrice(date);
            console.log(`Gold price for ${format(parseISO(goldPrice.date), 'yyyy-MM-dd')}: ${goldPrice.price} PLN`);
            goldPrices.push(goldPrice);
          } catch (error) {
            if (error instanceof Error) {
              console.error(`Error fetching price for ${date}: ${error.message}`);
            } else {
              console.error(`Unknown error for ${date}`);
            }
          }
        }

        // Send all collected prices to API
        if (goldPrices.length > 0) {
          if (goldPrices.length === 1) {
            await sendSingleGoldPriceToApi(goldPrices[0]);
          } else {
            await sendMultipleGoldPricesToApi({prices: goldPrices});
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Unknown error occurred');
        }
        process.exit(1);
      }
    });

  program.parse();
}

main(); 