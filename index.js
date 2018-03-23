const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendAdminNotification = functions.database.ref('/Malayalam/{date}/{pushId}').onWrite(event => {
  const date = event.params.date;

  const news = event.data.val();
  if(news.priority==1){
    console.log('New Important News:',news.title);
    const payload = {
        notification: {
          title: 'നോക്കൂ',
          body: `${news.title}`,
          sound:'default'
        },
        data:{
            click_action:`${news.title}`
        }
      };
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24 * 2
      };
      
    return admin.messaging().sendToTopic("ML_NEWS",payload,options)
        .then(function(response){
            console.log('Notification sent successfully:',response);
        })
        .catch(function(error){
            console.log('Notification sent failed:',error);
        });
  }
});
