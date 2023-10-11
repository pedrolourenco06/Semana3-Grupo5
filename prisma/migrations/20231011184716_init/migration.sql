-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "streams" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "artistaId" INTEGER,
    CONSTRAINT "Music_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Playlist" (
    "userId" TEXT NOT NULL,
    "musicId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "musicId"),
    CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Playlist_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
