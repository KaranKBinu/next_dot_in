"use client";

export type PincodeData = {
  pincode: string;
  city: string;
  state: string;
  areas: string[];
};

const CACHE_KEY = "next_in_pincode_cache";

function getPincodeCache(): Record<string, PincodeData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setPincodeCache(pincode: string, data: PincodeData) {
  if (typeof window === "undefined") return;
  try {
    const cache = getPincodeCache();
    cache[pincode] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

export async function fetchPincodeDetails(pincode: string): Promise<PincodeData | null> {
  const cleanPin = pincode.trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return null;
  }

  // 1. Check LocalStorage Cache
  const cache = getPincodeCache();
  if (cache[cleanPin]) {
    return cache[cleanPin];
  }

  // 2. Fetch from India Post Pincode API
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0 || data[0].Status !== "Success") {
      return null;
    }

    const postOffices: Array<{ Name: string; District: string; State: string }> =
      data[0].PostOffice || [];

    if (postOffices.length === 0) return null;

    const city = postOffices[0].District;
    const state = postOffices[0].State;
    const areas = Array.from(new Set(postOffices.map((po) => po.Name).filter(Boolean)));

    const result: PincodeData = {
      pincode: cleanPin,
      city,
      state,
      areas,
    };

    // Save to Cache
    setPincodeCache(cleanPin, result);
    return result;
  } catch (err) {
    console.error("Failed to fetch pincode details:", err);
    return null;
  }
}
