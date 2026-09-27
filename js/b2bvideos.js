/**
 * Nanashino-chan B2B Video Catalog
 * Production-oriented prototype data file
 *
 * Load this file before b2b-player.js:
 * <script src="../js/b2bvideos.js"></script>
 * <script src="../js/b2b-player.js"></script>
 *
 * Main API:
 * window.NanashinoB2B.getAlbum(albumSlug)
 * window.NanashinoB2B.getTrackByIsrc(isrc)
 * window.NanashinoB2B.getVideoId(isrc)
 * window.NanashinoB2B.getAlbumVideoIds(albumSlug)
 * window.NanashinoB2B.validate()
 */

(function initializeNanashinoB2BCatalog(global) {
  "use strict";

  const catalog = {
    schemaVersion: "1.1.0",
    updatedAt: "2026-09-27",
    albums: {
      "chillhop-lofi-relax-focus-instrumental": {
        slug: "chillhop-lofi-relax-focus-instrumental",
        title: "Chillhop Lo-Fi Relax & Focus (Instrumental)",
        artist: "Nanashino-chan",
        label: "8831422 Records CH",
        uploadDate: "2025-02-13",
        releaseDate: "2025-02-13",
        distributionUpc: "199082252091",
        format: "album",
        trackCount: 26,
        instrumental: true,
        tags: ["chillhop", "lo-fi", "relax", "focus", "instrumental"],
        rights: {
          masterRecording: "directly-managed",
          composition: "directly-managed",
          oneStopLicensing: true,
          licensingUrl: "https://nanashino-chan.github.io/site/licensing.html"
        },
        tracks: [
          {
            number: 1,
            title: "Evening Breeze",
            isrc: "QZES92531572",
            youtubeId: "tOQQZ8Y4PiY"
          },
          {
            number: 2,
            title: "City Lights Reflections",
            isrc: "QZES92531573",
            youtubeId: "3B8ZMRUhgz0"
          },
          {
            number: 3,
            title: "Velvet Sky",
            isrc: "QZES92531574",
            youtubeId: "q2MxqG7PnVU"
          },
          {
            number: 4,
            title: "Midnight Walk",
            isrc: "QZES92531575",
            youtubeId: "ZlfP3CZezf4"
          },
          {
            number: 5,
            title: "Chill Hop Groove",
            isrc: "QZES92531576",
            youtubeId: "vMx0x6AAuGw"
          },
          {
            number: 6,
            title: "Soft Steps",
            isrc: "QZES92531577",
            youtubeId: "42cFykviBOw"
          },
          {
            number: 7,
            title: "Chill Dreams",
            isrc: "QZES92531578",
            youtubeId: "7HWy_a8FKus"
          },
          {
            number: 8,
            title: "Cool Night Air",
            isrc: "QZES92531579",
            youtubeId: "vIB8IwEx-5M"
          },
          {
            number: 9,
            title: "Jazz & Beats",
            isrc: "QZES92531580",
            youtubeId: "pyimrJmztY4"
          },
          {
            number: 10,
            title: "Lounge Lullaby",
            isrc: "QZES92531581",
            youtubeId: "sZma3f22cjU"
          },
          {
            number: 11,
            title: "Urban Calm",
            isrc: "QZES92531582",
            youtubeId: "o8pGSjxMbXA"
          },
          {
            number: 12,
            title: "Rhythmic Relaxation",
            isrc: "QZES92531583",
            youtubeId: "QngvThcVLK4"
          },
          {
            number: 13,
            title: "Smooth Transitions",
            isrc: "QZES92531584",
            youtubeId: "MBsx4sUtNxs"
          },
          {
            number: 14,
            title: "Nightfall Vibes",
            isrc: "QZES92531585",
            youtubeId: "FcWLb54O-Xo"
          },
          {
            number: 15,
            title: "Chill Hop Echoes",
            isrc: "QZES92531586",
            youtubeId: "mcBfjz2H2Hg"
          },
          {
            number: 16,
            title: "Moonlit",
            isrc: "QZES92531587",
            youtubeId: "wNF1SogeWzU"
          },
          {
            number: 17,
            title: "Jazz Fusion Beat",
            isrc: "QZES92531588",
            youtubeId: "eDizSujWyqA"
          },
          {
            number: 18,
            title: "Dreamy Vibes",
            isrc: "QZES92531589",
            youtubeId: "GnlFdt0Vb14"
          },
          {
            number: 19,
            title: "Serenade in Blue",
            isrc: "QZES92531590",
            youtubeId: "Ys7xsA8F1q4"
          },
          {
            number: 20,
            title: "Softly Spoken",
            isrc: "QZES92531591",
            youtubeId: "B2z6HCdctE4"
          },
          {
            number: 21,
            title: "Evening Melodies",
            isrc: "QZES92531592",
            youtubeId: "J_ybJwELfbg"
          },
          {
            number: 22,
            title: "Quiet Reflections",
            isrc: "QZES92531593",
            youtubeId: "kJBJd5ehJmk"
          },
          {
            number: 23,
            title: "Nocturnal Journey",
            isrc: "QZES92531594",
            youtubeId: "kvIz-MNneAc"
          },
          {
            number: 24,
            title: "Tranquil Jazz",
            isrc: "QZES92531595",
            youtubeId: "O_RLNql0OhI"
          },
          {
            number: 25,
            title: "Chill Night Sessions",
            isrc: "QZES92531596",
            youtubeId: "4bnoHteo-lk"
          },
          {
            number: 26,
            title: "Closing Serenade",
            isrc: "QZES92531597",
            youtubeId: "sb4vo2QPWrg"
          }
        ]
      },
      "retro-pulse-lofi-synth-grooves-from-the-night": {
        slug: "retro-pulse-lofi-synth-grooves-from-the-night",
        title: "Retro Pulse: Lo-Fi Synth Grooves from the Night",
        artist: "Nanashino-chan",
        label: "8831422 Records CH",
        uploadDate: "2025-04-12",
        releaseDate: "2025-04-30",
        distributionUpc: "199337144744",
        format: "album",
        trackCount: 24,
        instrumental: true,
        tags: ["lo-fi", "synth", "retro", "night", "instrumental"],
        rights: {
          masterRecording: "directly-managed",
          composition: "directly-managed",
          oneStopLicensing: true,
          licensingUrl: "https://nanashino-chan.github.io/site/licensing.html"
        },
        tracks: [
          {
            number: 1,
            title: "Midnight Reflections",
            isrc: "QZMEN2551430",
            youtubeId: "CI9JX-r0DgY"
          },
          {
            number: 2,
            title: "Neon Dreamscape",
            isrc: "QZMEN2551431",
            youtubeId: "n3rpu23Q4rs"
          },
          {
            number: 3,
            title: "Echoes of the 80s",
            isrc: "QZMEN2551432",
            youtubeId: "SBS2N7OaLbY"
          },
          {
            number: 4,
            title: "Cosmic Ride",
            isrc: "QZMEN2551433",
            youtubeId: "wooVVSMqbVg"
          },
          {
            number: 5,
            title: "Vaporwave Streets",
            isrc: "QZMEN2551434",
            youtubeId: "mtQwxopXhYo"
          },
          {
            number: 6,
            title: "Electric Twilight",
            isrc: "QZMEN2551435",
            youtubeId: "5BQUu778j2Y"
          },
          {
            number: 7,
            title: "Digital Sunset",
            isrc: "QZMEN2551436",
            youtubeId: "VYMUzR85Zgw"
          },
          {
            number: 8,
            title: "Chromatic Waves",
            isrc: "QZMEN2551437",
            youtubeId: "JTUv4um7GoQ"
          },
          {
            number: 9,
            title: "Retro Vibes",
            isrc: "QZMEN2551438",
            youtubeId: "AE2QX_phV2o"
          },
          {
            number: 10,
            title: "Glowing Horizons",
            isrc: "QZMEN2551439",
            youtubeId: "mEh4fL86Knk"
          },
          {
            number: 11,
            title: "Lunar Voyage",
            isrc: "QZMEN2551440",
            youtubeId: "C5NyE462jgk"
          },
          {
            number: 12,
            title: "Pixelated Memories",
            isrc: "QZMEN2551441",
            youtubeId: "ZXkhIwXwfts"
          },
          {
            number: 13,
            title: "Analog Nights",
            isrc: "QZMEN2551442",
            youtubeId: "h8i1SxgaVfM"
          },
          {
            number: 14,
            title: "Starry Synths",
            isrc: "QZMEN2551443",
            youtubeId: "GUyYQOjzuQ8"
          },
          {
            number: 15,
            title: "Cinematic Breeze",
            isrc: "QZMEN2551444",
            youtubeId: "7nEkHp7pagk"
          },
          {
            number: 16,
            title: "Faded Signals",
            isrc: "QZMEN2551445",
            youtubeId: "fchv2mGjExg"
          },
          {
            number: 17,
            title: "Time Traveler's Groove",
            isrc: "QZMEN2551446",
            youtubeId: "ehQYQ-95MEo"
          },
          {
            number: 18,
            title: "Retro Pulse",
            isrc: "QZMEN2551447",
            youtubeId: "yifhvQPGfxw"
          },
          {
            number: 19,
            title: "Electric Moonlight",
            isrc: "QZMEN2551448",
            youtubeId: "zVvd5fnSCqE"
          },
          {
            number: 20,
            title: "Synthesizer Dreams",
            isrc: "QZMEN2551449",
            youtubeId: "fLi8C8OD7J4"
          },
          {
            number: 21,
            title: "Neon Noir",
            isrc: "QZMEN2551450",
            youtubeId: "gKa_yMfPZE8"
          },
          {
            number: 22,
            title: "Nostalgic Drive",
            isrc: "QZMEN2551451",
            youtubeId: "Fi3PEPJYJeY"
          },
          {
            number: 23,
            title: "Cyber City",
            isrc: "QZMEN2551452",
            youtubeId: "e9JmagU2QY0"
          },
          {
            number: 24,
            title: "Endless Nightfall",
            isrc: "QZMEN2551453",
            youtubeId: "UcmzWj1QYYk"
          }
        ]
      }
    }
  };

  function normalizeIsrc(value) {
    return String(value || "")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase();
  }

  const tracksByIsrc = Object.create(null);
  const albumSlugByIsrc = Object.create(null);

  Object.values(catalog.albums).forEach((album) => {
    album.tracks.forEach((track) => {
      const normalizedIsrc = normalizeIsrc(track.isrc);
      tracksByIsrc[normalizedIsrc] = track;
      albumSlugByIsrc[normalizedIsrc] = album.slug;
    });
  });

  function getAlbum(albumSlug) {
    return catalog.albums[String(albumSlug || "")] || null;
  }

  function getTrackByIsrc(isrc) {
    return tracksByIsrc[normalizeIsrc(isrc)] || null;
  }

  function getVideoId(isrc) {
    const track = getTrackByIsrc(isrc);
    return track ? track.youtubeId : null;
  }

  function getAlbumSlugByIsrc(isrc) {
    return albumSlugByIsrc[normalizeIsrc(isrc)] || null;
  }

  function getAlbumVideoIds(albumSlug) {
    const album = getAlbum(albumSlug);
    return album ? album.tracks.map((track) => track.youtubeId) : [];
  }

  function validateCatalog() {
    const errors = [];
    const seenIsrc = new Set();
    const seenYoutubeIds = new Set();
    const isrcPattern = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/;
    const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
    const upcPattern = /^[0-9]{12,14}$/;

    Object.entries(catalog.albums).forEach(([albumSlug, album]) => {
      if (album.slug !== albumSlug) {
        errors.push(`${albumSlug}: album.slug does not match its catalog key.`);
      }

      if (!upcPattern.test(album.distributionUpc)) {
        errors.push(`${albumSlug}: invalid distribution UPC ${album.distributionUpc}.`);
      }

      if (album.trackCount !== album.tracks.length) {
        errors.push(`${albumSlug}: trackCount is ${album.trackCount}, but ${album.tracks.length} tracks were found.`);
      }

      album.tracks.forEach((track, index) => {
        const expectedNumber = index + 1;
        const normalizedIsrc = normalizeIsrc(track.isrc);

        if (track.number !== expectedNumber) {
          errors.push(`${albumSlug}: expected track number ${expectedNumber}, found ${track.number}.`);
        }

        if (!track.title || !track.title.trim()) {
          errors.push(`${albumSlug} track ${track.number}: missing title.`);
        }

        if (!isrcPattern.test(normalizedIsrc)) {
          errors.push(`${albumSlug} track ${track.number}: invalid ISRC ${track.isrc}.`);
        }

        if (seenIsrc.has(normalizedIsrc)) {
          errors.push(`${albumSlug} track ${track.number}: duplicate ISRC ${normalizedIsrc}.`);
        }
        seenIsrc.add(normalizedIsrc);

        if (!youtubeIdPattern.test(track.youtubeId)) {
          errors.push(`${albumSlug} track ${track.number}: invalid YouTube ID ${track.youtubeId}.`);
        }

        if (seenYoutubeIds.has(track.youtubeId)) {
          errors.push(`${albumSlug} track ${track.number}: duplicate YouTube ID ${track.youtubeId}.`);
        }
        seenYoutubeIds.add(track.youtubeId);
      });
    });

    return errors;
  }

  const validationErrors = validateCatalog();

  if (validationErrors.length) {
    console.error("Nanashino-chan B2B catalog validation failed:", validationErrors);
  }

  global.NanashinoB2B = Object.freeze({
    schemaVersion: catalog.schemaVersion,
    updatedAt: catalog.updatedAt,
    albums: catalog.albums,
    getAlbum,
    getTrackByIsrc,
    getVideoId,
    getAlbumSlugByIsrc,
    getAlbumVideoIds,
    validate: validateCatalog,
    validationErrors: Object.freeze(validationErrors.slice())
  });

  // Simple compatibility map for pages that only need ISRC -> YouTube ID.
  global.b2bVideos = Object.freeze(
    Object.fromEntries(
      Object.entries(catalog.albums).map(([albumSlug, album]) => [
        albumSlug,
        Object.freeze(
          Object.fromEntries(
            album.tracks.map((track) => [normalizeIsrc(track.isrc), track.youtubeId])
          )
        )
      ])
    )
  );
})(window);
