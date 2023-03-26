# JAPI.rest

[![downloadsBadge](https://img.shields.io/npm/dt/japi.rest?style=for-the-badge)](https://npmjs.com/japi.rest)
[![versionBadge](https://img.shields.io/npm/v/japi.rest?style=for-the-badge)](https://npmjs.com/japi.rest)

## Installation

```bash
npm install japi.rest
```

## Example

```js
const japiRestPkg = require('japi.rest');
const japiRest = new japiRestPkg('Your JAPI Key'); // Get ur japi key from https://key.japi.rest

japiRest.discord.getUser('209796601357533184').then(user => console.log(user));

```

## Endpoints

| Endpoint      | Service                      | Routes                       |
|:-------------:|------------------------------|------------------------------|
| `deviantart` | [DeviantArt](https://www.deviantart.com/) | getTopics |
| `discord` | [Discord](https://discord.com/) | getUser, getInvite, getTemplate, getApplication |
| `meta` | [Meta Fetcher](https://cards-dev.twitter.com/validator) | get |
| `mywaifulist` | [MyWaifuList](https://mywaifulist.moe/) | getWaifu, getWaifuRandom, searchSeries, getSeries, topTierWaifus, mostPopular, topTrash, vTubers, seasonalBestWaifus, seasonalWorstWaifus, seasonalPopularWaifus |  
| `patreon` | [Patreon](https://patreon.com) | getCreator |
| `pcpartpicker` | [PCPartPicker](https://pcpartpicker.com/) | getList |
| `presence` | [JAPI Presence](https://docs.japi.rest/#japi-presence) | get |
| `tiktok` | [TikTok](https://tiktok.com) | getCreator |
| `wikihow` | [WikiHow](https://wikihow.com/) | search, info |
