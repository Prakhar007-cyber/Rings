// Verified Unsplash photography — each image reviewed for subject and quality.
const u = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&fm=jpg&fit=max`;

export const IMG = {
  // Product — rings
  solitaire: u("1605100804763-247f67b3557e"), // solitaire diamond halo ring on black
  pave: u("1589674781759-c21c37956a44"), // white gold pavé diamond ring
  rose: u("1603561591411-07134e71a2a9"), // rose gold halo ring, blush stone
  bands: u("1606800052052-a08af7148866"), // two yellow gold bands
  heritage: u("1611955167811-4711904bb9f8"), // ornate gold cluster ring, macro on linen
  ruby: u("1617117811969-97f441511dee"), // gold ring with ruby on pearls, warm light
  sculptural: u("1608042314453-ae338d80c427"), // sculptural gold stone rings on pebble
  paveDetail: u("1611591437281-460bfbe1220a"), // pavé setting macro detail
  // Lifestyle — the moment
  handsRaised: u("1596944924616-7b38e7cfac36"), // hands wearing gold rings, blush tones
  coupleHands: u("1529634806980-85c3dd6d34ac"), // couple hands, wedding rings
  ringBox: u("1512163143273-bde0e3cc7407"), // engagement ring in a box
  wornGold: u("1620656798579-1984d9e87df7"), // sculptural gold ring worn, black knit
};

export const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLTk1MjIxNzc7PkE+OT5BRUlOSkFFRU5XW1NTW2NlZWNjY2NjY2P/2wBDARUXFx4aHR4eHWNBOUFjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAIAAwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAfEAACAgEEAwAAAAAAAAAAAAABAgMRAAQSITFBUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzNPqI4dPGh08blVALHs/cYxjAf/Z";
