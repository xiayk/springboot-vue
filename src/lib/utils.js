export function formateDate(value) {
    let date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    // return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;//多种时间格式的拼接
    return y + '年' + MM + '月' + d + '日 ' + h + ':' + m;
}

export function getType(data) {
    if (data.key) {
        let type = data.key.substring(data.key.lastIndexOf('.') + 1, (data.key).lenght);
        if (type == "jpg" || type == "png" || type == "png" || type == "jpeg") {
            return 'el-icon-picture-outline x_green x_size_20'
        } else if(type == "zip" || type == "rar" || type == 'tag' || type == ""){
            return 'el-icon-box x_blue x_size_20';
        }else {
            return 'el-icon-document x_size_20';
        }
    } else {
        data = data.key;
        return 'el-icon-folder x_orange x_size_20';
    }
}

export function formateArr(data){
    let arr = [];
    console.log(data)
    for (const key in data) {
        arr.push(data[key].substring(0, data[key].length-1));
    }
    return arr;
}