const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// 读取manifest版本号
const manifest = JSON.parse(fs.readFileSync('manifest.json'));
const version = manifest.version;

// 创建打包目录
const buildDir = 'build';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Chrome打包函数
function buildChrome() {
  try {
    const outputPath = path.join(buildDir, `crypto-price-converter_v${version}.zip`);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Chrome扩展包已生成: ${outputPath}`);
    });

    archive.pipe(output);
    archive.directory('.', false, { ignore: ['build', 'node_modules'] });
    archive.finalize();
  } catch (err) {
    console.error('Chrome打包失败:', err);
  }
}

// Firefox打包函数
function buildFirefox() {
  try {
    const filename = `crypto-price-converter_v${version}.xpi`;
    execSync(`web-ext build --source-dir . --artifacts-dir ${buildDir} --filename ${filename}`);
    console.log(`Firefox附加组件已生成: ${path.join(buildDir, filename)}`);
  } catch (err) {
    console.error('Firefox打包失败:', err);
  }
}

// 执行打包
buildChrome();
buildFirefox();
console.log('打包完成！');