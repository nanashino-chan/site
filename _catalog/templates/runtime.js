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
    return track ? track.youtubeId || null : null;
  }

  function getAlbumSlugByIsrc(isrc) {
    return albumSlugByIsrc[normalizeIsrc(isrc)] || null;
  }

  function getAlbumVideoIds(albumSlug) {
    const album = getAlbum(albumSlug);
    return album ? album.tracks.filter((track) => track.youtubeId).map((track) => track.youtubeId) : [];
  }

  function validAppleMusicUrl(value) {
    return typeof value === "string" && /^https:\/\/music\.apple\.com\/[a-z]{2}\/album\/[^/?#]+\/\d+$/.test(value);
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

      if (album.appleMusicUrl !== undefined && !validAppleMusicUrl(album.appleMusicUrl)) {
        errors.push(`${albumSlug}: invalid Apple Music album URL.`);
      }
      const youtubeCount = album.tracks.filter(track => track.youtubeId).length;
      if (youtubeCount && youtubeCount !== album.tracks.length) errors.push(`${albumSlug}: mixed preview sources.`);
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

        if (track.youtubeId != null && !youtubeIdPattern.test(track.youtubeId)) {
          errors.push(`${albumSlug} track ${track.number}: invalid YouTube ID ${track.youtubeId}.`);
        }

        if (track.youtubeId != null && seenYoutubeIds.has(track.youtubeId)) {
          errors.push(`${albumSlug} track ${track.number}: duplicate YouTube ID ${track.youtubeId}.`);
        }
        if (track.youtubeId != null) seenYoutubeIds.add(track.youtubeId);
        else if (!album.appleMusicUrl) errors.push(`${albumSlug} track ${track.number}: missing preview source.`);
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
            album.tracks.filter((track) => track.youtubeId).map((track) => [normalizeIsrc(track.isrc), track.youtubeId])
          )
        )
      ])
    )
  );
