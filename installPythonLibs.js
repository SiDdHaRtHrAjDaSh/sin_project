const { exec } = require("child_process");


const installLibs = () => new Promise(async (resolve, reject) => {
    console.log('Installing network libraries...');
    try{
        await installNetworkx();
        await installCommunity();
        resolve();
    }catch(err){
        reject(err);
    }
});

const installNetworkx = () => new Promise((resolve, reject) => {
    console.log('Installing networkx library...');
    exec("pip install networkx", async (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject(error.message);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log('Networkx library installed.');
        resolve();
    });
});


const installCommunity = () => new Promise((resolve, reject) => {
    console.log('Installing community library...');
    exec("pip install community", async (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject(error.message);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log('Community library installed.');
        resolve();
    });
});

module.exports = installLibs;