function textify(data) {
    var text = '';

    for(var k in data) {

        
        if(typeof data[k] == 'object') {
            text += k + ' ------ \n' + textify(data[k]) + '-----------------';
        } else {
            text += k + ' : ' + data[k] + '\n';
        }
    }
    return text;
}

var gyro = document.getElementById('gyro');
