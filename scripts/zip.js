const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const JSZIP = require('jszip');
const ora = require('ora');

const excludePatterns = [
  /\.(zip|git|idea)$/,
  /node_modules/,
  /\.env\.local/
];

const zipFilePath = path.resolve(process.cwd(), `${ pkg.name }.zip`);

if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
  console.info(`旧文件：${ zipFilePath } 已删除`);
}

// 新建一个zip压缩对象实例
const zip = new JSZIP();

const spinner = ora({
  color: 'red',
  prefixText: `新文件 ${ pkg.name }.zip 压缩中`,
  spinner: 'bouncingBar'
});

spinner.start();
// 压缩项目根目录下的所有文件
pushZip(zip, path.resolve(process.cwd()));

// 异步生成压缩文件
zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: {
    level: 9
  }
}).then(function (content) {
  // 保存到本地
  fs.writeFile(path.resolve(process.cwd(), `./${ pkg.name }.zip`), content, err => {
    if (err) throw err;
    spinner.succeed(`\n文件已保存 路径：${ path.resolve(process.cwd(), `./${ pkg.name }.zip`) }`);
  });
});

function pushZip(floder, pPath) {
  const files = fs.readdirSync(pPath, { withFileTypes: true });
  files.forEach((dirent) => {

    var shouldExclude = excludePatterns.some(function (pattern) {
      return pattern.test(dirent.name);
    });

    if (shouldExclude) {
      // 剔除压缩文件
      console.log('排除文件：', dirent.name);
      return;
    }

    // 替换分隔符，兼容linux
    let filePath = path.resolve(pPath, dirent.name).split(path.sep).join('/');
    if (dirent.isDirectory()) {
      // 压缩一个文件夹
      const pt = path.resolve(process.cwd()).split(path.sep).join('/');
      let zipFloder = zip.folder(filePath.replace(`${ pt }/`, ''));
      pushZip(zipFloder, filePath);
    } else {
      // 压缩一个文件
      floder.file(dirent.name, fs.readFileSync(filePath));
    }
  });
}
