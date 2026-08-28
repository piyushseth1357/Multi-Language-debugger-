const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// We can use esbuild or zlib or node built-in zip creation
// Let's create a pure Node.js zip file writer with forward slashes!

function createZipBuffer(entries) {
  // Simple zip generator ensuring forward slashes
  const localHeaders = [];
  const cdEntries = [];
  let offset = 0;

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.name.replace(/\\/g, '/'), 'utf8');
    const dataBuf = Buffer.from(entry.content);

    // Local file header
    const lh = Buffer.alloc(30 + filenameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // Local header sig
    lh.writeUInt16LE(20, 4);        // Version needed
    lh.writeUInt16LE(0, 6);         // Flags
    lh.writeUInt16LE(0, 8);         // Compression (0 = store)
    lh.writeUInt32LE(0, 10);        // Time/date
    lh.writeUInt32LE(crc32(dataBuf), 14); // CRC32
    lh.writeUInt32LE(dataBuf.length, 18); // Compressed size
    lh.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    lh.writeUInt16LE(filenameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    filenameBuf.copy(lh, 30);

    // Central Directory entry
    const cd = Buffer.alloc(46 + filenameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0); // CD sig
    cd.writeUInt16LE(20, 4);         // Version made by
    cd.writeUInt16LE(20, 6);         // Version needed
    cd.writeUInt16LE(0, 8);          // Flags
    cd.writeUInt16LE(0, 10);         // Compression
    cd.writeUInt32LE(0, 12);         // Time/date
    cd.writeUInt32LE(crc32(dataBuf), 16); // CRC32
    cd.writeUInt32LE(dataBuf.length, 20); // Compressed size
    cd.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
    cd.writeUInt16LE(filenameBuf.length, 28);
    cd.writeUInt16LE(0, 30);         // Extra length
    cd.writeUInt16LE(0, 32);         // Comment length
    cd.writeUInt16LE(0, 34);         // Disk start
    cd.writeUInt16LE(0, 36);         // Internal attr
    cd.writeUInt32LE(0, 38);         // External attr
    cd.writeUInt32LE(offset, 42);    // Local header offset
    filenameBuf.copy(cd, 46);

    localHeaders.push(lh, dataBuf);
    cdEntries.push(cd);

    offset += lh.length + dataBuf.length;
  }

  const cdStart = offset;
  let cdSize = 0;
  for (const cd of cdEntries) {
    cdSize += cd.length;
  }

  // End of Central Directory record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD sig
  eocd.writeUInt16LE(0, 4);          // Disk num
  eocd.writeUInt16LE(0, 6);          // Start disk
  eocd.writeUInt16LE(cdEntries.length, 8); // Entries on disk
  eocd.writeUInt16LE(cdEntries.length, 10); // Total entries
  eocd.writeUInt32LE(cdSize, 12);     // CD size
  eocd.writeUInt32LE(cdStart, 16);    // CD offset
  eocd.writeUInt16LE(0, 20);          // Comment length

  return Buffer.concat([...localHeaders, ...cdEntries, eocd]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// 1. Read plugin.xml
const xmlPath = path.join(__dirname, 'jetbrains-plugin', 'META-INF', 'plugin.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

// 2. Build inner jar with forward slashes: META-INF/plugin.xml
const jarBuf = createZipBuffer([
  { name: 'META-INF/plugin.xml', content: xmlContent }
]);

const jarPath = path.join(__dirname, 'piyushseth-error-debugger.jar');
fs.writeFileSync(jarPath, jarBuf);

// 3. Build outer zip with forward slashes: piyushseth-error-debugger/lib/piyushseth-error-debugger.jar
const zipBuf = createZipBuffer([
  { name: 'piyushseth-error-debugger/lib/piyushseth-error-debugger.jar', content: jarBuf },
  { name: 'piyushseth-error-debugger/META-INF/plugin.xml', content: xmlContent }
]);

const zipPath = path.join(__dirname, 'piyushseth-error-debugger-jetbrains-1.0.0.zip');
fs.writeFileSync(zipPath, zipBuf);

console.log("SUCCESS: Pure POSIX Forward-Slash JetBrains ZIP & JAR Built!");
console.log("JAR Path:", jarPath);
console.log("ZIP Path:", zipPath);
