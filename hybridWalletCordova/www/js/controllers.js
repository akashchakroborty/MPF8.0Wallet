angular.module('app.controllers', [])

.controller('CardsCtrl', function($scope, safeApply, cardService, $ionicModal, $rootScope) {
  document.addEventListener('MFPinit', initComplete, false);

  $scope.user = {};
  $scope.cardsImages = [];
  $scope.errorText = '';
  $scope.displayError = false;
  $scope.cardIndex = {};
  $scope.cardIndex.id = 1;
  $scope.cardTransactions = {};
  $scope.currentTransactions = {};

  $scope.loadCards = function () {
    console.log('---> called loadCards');
      var DataRequest = cardService.requestCards();

      DataRequest.then(function(result){
        $scope.cards = result.cards;
        var i = 0;
        var n = $scope.cards.length;
        console.log('---> Cards loaded ', $scope.cards);
        angular.forEach($scope.cards, function(value, key) {
          var canvas = document.getElementById("cardCanvas");
          var context = canvas.getContext("2d");
          var imageObj = new Image();
          imageObj.src = "img/card.png";
          imageObj.onload = function() {
            context.drawImage(imageObj, 10, 10);
            context.font = "1.1em Courier New";
            context.fillStyle = "white";
            context.fillText(value.cn, 37, 110);
            context.font = "0.6em Courier New";
            context.fillText(value.name, 37, 137);
            context.fillText(value.date, 133, 137);
            $scope.currentImg = canvas.toDataURL();
            $scope.cardsImages.push({id: value.id, img: $scope.currentImg});
            imageObj = [];
            i++;
            if (i == n) {
              $scope.$watch("cardIndex.id", function() {
                $scope.loadTransactions($scope.cardIndex.id);
              })
              $scope.loadTransactions($scope.cardIndex.id);
              $rootScope.loadMessages();
              $scope.initPush();
            }
          };
        });
      })
  };

  $scope.initPush = function() {
    MFPPush.initialize(
      function(success){
        console.log('--> push init success');

        MFPPush.registerNotificationsCallback($scope.NotificationReceived);
        var options = {"phoneNumber": ""};

        MFPPush.registerDevice(
          options,
          function(success){

            console.log('--> push register success');
            var tag = ['wallet'];

            MFPPush.subscribe(
              tag,
              function(success){
                console.log('--> push subscribe success');
              },
              function(failure){
                console.log('--> push subscribe failure', failure);
              }
            )
          },
          function(failure){
            console.log('--> push register failure', failure);
          }
        )
      },
      function(failure){
        console.log('--> push init failure', failure);
      }
    ) 
  }

  $scope.NotificationReceived = function(message) {
    console.log('--> push notification received', message)
    alert(message.alert);
  }

  $scope.loadTransactions = function(cindex) {
    console.log('---> called loadTransactions for index ', cindex);

    var cardId = $scope.cards[cindex].id;

    console.log('---> card id is ', cardId);

    if (typeof $scope.cardTransactions[cardId] === 'undefined') {
      console.log('---> requesting transactions from server');
      var DataRequest = cardService.requestTransactions(cardId);

      DataRequest.then(function(result){
        $scope.cardTransactions[cardId] = result;
        console.log('---> card transactions are ', $scope.cardTransactions[cardId]);
        $scope.currentTransactions = $scope.cardTransactions[cardId];
        safeApply($scope);
      });
    } else {
      console.log('---> already have transactions for this card');
      console.log('---> card transactions are ', $scope.cardTransactions[cardId]);
      $scope.currentTransactions = $scope.cardTransactions[cardId];
      safeApply($scope);
    }


  };

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  function initComplete() {
    console.log('---> WL init completed');

    var AuthRealmChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("UserLogin");


    AuthRealmChallengeHandler.handleChallenge = function(response){
 
        console.log('--> inside handleChallenge');
        $scope.openModal();

    		if (response.errorMsg) {
            msg = response.errorMsg + "\n"; 
          }
        else {
          msg = "Please enter username and password \n"
        }  

        msg += "Remaining attempts: " + response.remainingAttempts;

        $scope.errorText = msg;
        $scope.displayError = true;
    };

   AuthRealmChallengeHandler.handleSuccess = function(response){
        console.log('--> inside handleSuccess');

        $scope.errorText = '';
        $scope.user = {};
        $scope.displayError = false;
        $scope.closeModal();
   }


    $scope.doLogin = function () {
      console.log('---> trying to perform auth with user ', $scope.user.name);

    	AuthRealmChallengeHandler.submitChallengeAnswer({"username": $scope.user.name, "password": $scope.user.password});
    };


    $scope.loadCards();
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('MessagesCtrl', function($scope, safeApply) {
  $scope.messages = {};
  var collectionName = 'messages';

  WL.JSONStore.get(collectionName).findAll().then(function(arrayResults){
    $scope.messages = arrayResults;
    console.log('---> messages loaded ', $scope.messages);
    safeApply($scope);
  })

})

.controller('SettingsCtrl', function($scope, $state, cardService, $rootScope) {

  $scope.setLimit = function(newLimit) {
    console.log('---> new limit to be set ', newLimit.number);

    var DataRequest = cardService.requestLimit();

    DataRequest.then(function(result){
      console.log('---> limit service responce ', result);
      $state.go('tab.cards');
    });
  };

})

.controller('TabsCtrl', function($scope, safeApply, $ionicActionSheet, cardService, $state, $rootScope) {
    $rootScope.limit = {};
    $rootScope.selectedLimit = {};
    $scope.countNew = '';

    $rootScope.loadMessages = function () {
      var DataRequest = cardService.requestMessages();

      DataRequest.then(function(result){
        console.log('---> messages service responce ', result);

        $scope.countNew = result.messages.length;
        console.log('---> We got ', $scope.countNew, ' messages');
        safeApply($scope);

        var collections = {
          messages : {
            searchFields: {text: 'string', date: 'string'}
          }
        }

        var options = {};

        WL.JSONStore.init(collections, options).then(function () {
          console.log('---> collection init success ');
          var collectionName = 'messages';

          var changeOptions = {
            replaceCriteria: ['text', 'date'],
            addNew: true,
            markDirty:false
          };


          WL.JSONStore.get(collectionName).change(result.messages, changeOptions).then(function(loadedDocs){
            console.log('---> collection docs add success, loaded ', loadedDocs, ' docs');
          }).fail(function(error){
            console.log('---> collection docs add failed, error', error);
          })

        }).fail(function(error) {
          console.log('---> collection init failed ', error);
        })

      });
    };

    $scope.showSettings = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Change limit' }
       ],
       titleText: 'Settings',
       cancelText: 'Logout',
       cancel: function() {
            console.log('---> trying to logout ');
            // WL.Client.logout('AuthRealm');
          },
       buttonClicked: function(index) {
         if (index == 0) {

           var DataRequest = cardService.requestLimit();

           DataRequest.then(function(result){
             $rootScope.limit = result.options;
             console.log('---> limit options are ', $rootScope.limit);
             $rootScope.selectedLimit = { number: result.currentLimit};
             console.log('---> current limit is ', $rootScope.selectedLimit);
             $state.go('tab.settings-limits');
           });
         }
         return true;
       }
     });
   };
});