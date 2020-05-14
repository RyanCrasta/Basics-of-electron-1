const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
app.allowRendererProcessReuse = false;
app.on('ready',() =>{

mainWindow =  new BrowserWindow({webPreferences: {nodeIntegration: true}});
   mainWindow.loadURL(`file://${__dirname}/main.html`);
   mainWindow.on('closed', () => app.quit());
   const mainMenu = Menu.buildFromTemplate(menuTemplate);
   Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true},
        
        width: 300,
        height: 200,
        title: 'Add New Todo',
        
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);

}

ipcMain.on('todo:add', (event, todo) =>{
    mainWindow.webContents.send('todo:add', todo);
    //console.log(value);
    
    addWindow.close();
});
const menuTemplate = [
    
    {
        label: 'File',
        submenu:[
            {
                label: 'New Todo',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                //Immediately invoked function
                accelerator: (() => {
                    if(process.platform === 'darwin'){
                        return 'Command+Q';
                    }
                    else{
                        return 'Ctrl+Q';
                    }
                })(),
                click(){
                    app.quit();
                }
            },
            {
                label: 'Clear Todo',
                click()
                {
                    let clearMsg = "";
                    mainWindow.webContents.send('msg', clearMsg);
                }
            }
        ]
    }
];
if(process.platform === 'darwin')
{
    menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production')
{
    /*
    NODE_ENV can have 3 values
    'production'
    'development'
    'staging'
    */
    menuTemplate.push({
        label: 'View',

        submenu:[
            { role: 'reload'},
            {
                label: 'Toggle Developer Tools',
                accelerator: (() => {
                    if(process.platform === 'darwin'){
                        return 'Command+Alt+I';
                    }
                    else{
                        return 'Ctrl+Shift+I';
                    }
                })(),
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },

        ]
    });
}