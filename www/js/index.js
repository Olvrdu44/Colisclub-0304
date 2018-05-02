/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var app = {
    // Application Constructor
    initialize: function() 
	{
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		$(function()
		{
			load_connexion();
			
			function checkConnection() 
			{
				var networkState = navigator.connection.type;

				var states = {};
				states[Connection.UNKNOWN]  = 'Unknown connection';
				states[Connection.ETHERNET] = 'Ethernet connection';
				states[Connection.WIFI]     = 'WiFi connection';
				states[Connection.CELL_2G]  = 'Cell 2G connection';
				states[Connection.CELL_3G]  = 'Cell 3G connection';
				states[Connection.CELL_4G]  = 'Cell 4G connection';
				states[Connection.CELL]     = 'Cell generic connection';
				states[Connection.NONE]     = 'No network connection';

				// alert('Connection type: ' + states[networkState]);
				
				if( states[networkState] == "No network connection")
				{
					navigator.notification.alert("Vous n'êtes pas connecté au réseau", alertCallback, "Aucune connexion", "Fermer");
				}
			}
			/************************ FORMULAIRE CONNEXION INSCRIPTION ***************************/
			formulaire_et_label();

			$('.tab a').on('click', function (e) 
			{
				e.preventDefault();

				$(this).parent().addClass('active');
				$(this).parent().siblings().removeClass('active');

				target = $(this).attr('href');

				$('.tab-content > div').not(target).hide();

				$(target).fadeIn(600);

			});
			/********************************PASSWORD***********************/
			$("p.forgot").click(function()
			{
				$("#signup").hide();
				$("#login").hide();
				$("#password").show();
			});
			/********************* FAIRE APPARAITRE LES INFOS SIRET ET NOM ENTREPRISE  *********/
			$("input[name='statut']").click(function() 
			{
				if( $(this).val()!= "particulier" )
				{
					$('.info_company').show('blind');
				}
				else
				{
					$('.info_company').hide('blind');
				}
			});
			/********************* FAIRE APPARAITRE LE PERMIS SI VEHICULE PERMIS COCHE *********/
			$('.voirNumPermis').click(function() 
			{
				if( $('#scooter, #moto, #voiture, #fourgon, #camion').is(':checked'))
				{
					$('.infoSuperPermis').show('blind');
				}
				else
				{
					$('.infoSuperPermis').hide('blind');
				}
			});
			/********************AJAX D INSCRIPTION ***********************/
			$("#signup form").submit(function(e)
			{
				e.preventDefault();
				
				var verif_permis = false;
				var verif_form = true;
				var vehicule_a_envoyer = '';
				var verif_vehicule = false;
				
				nom = $("input[name='nom']").val();
				prenom = $("input[name='prenom']").val();
				date_naissance = $("input[name='date_naissance']").val();
				
				pass = $("input[name='pass']").val();
				pass_confirm = $("input[name='pass_confirm']").val();
				
				email = $("input[name='email']").val();
				tel = $("input[name='tel']").val();
				adresse = $("input[name='adresse']").val();
				
				//autocomplete hidden
				numero = $("input#street_number").val();
				rue = $("input#route").val();
				code_postal = $("input#postal_code").val();
				ville = $("input#locality").val();
				
				avatar = $("input[name='avatar']").val();
				presentation = $("textarea[name='presentation']").text();
				
				casier = $("input[name='casier']").val();
				statut = $("input[name='statut']").val();
				siret = $("input[name='siret']").val();
				company = $("input[name='company']").val();
				
				num_permis = $("input[name='num_permis']").val();
				permis = $("input[name='permis']").val();
				
				//on crée un tableau avec tous les vehicules (correpond aux id dans le html)
				var vehicules = [
				  "a_pied",
				  "velo",
				  "scooter",
				  "moto",
				  "voiture",
				  "fourgon",
				  "camion"
				];

				//on parcours le tableau pour verifier chaque checkbox
				$.each( vehicules, function( key, vehicule ) 
				{
					if( $("#" + vehicule).is(':checked'))
					{
						verif_vehicule = true;
						//on enregistre le véhicule dans la var a envoyer
						vehicule_a_envoyer += vehicule + '-';
						
						//si c est un vehicule motorise on cree une variable pour derriere verifier le permis 
						if(vehicule == 'scooter' || vehicule == 'moto' || vehicule == 'voiture' || vehicule == 'fourgon' || vehicule == 'camion')
						{
							verif_permis = true;
						}
					}
				});
				
				/************************** VERIFICATION DES ERREURS***************************/
				//si on doit verifier le permis
				if( verif_permis == true )
				{
					if(num_permis == '')
					{
						$("input[name='num_permis']").addClass('error');
						verif_form = false;
					}
					else
					{
						$("input[name='num_permis']").removeClass('error');
					}
					/////////////////////////
					if(permis == '')
					{
						navigator.notification.alert("Vous devez charger une photo de votre permis", alertCallback, "Erreur permis", "Fermer");
						verif_form = false;
					}
				}
				
				//si c ets pas un particulier il doit avoir renseigner son entreprise et son siret
				if(statut != "particulier")
				{
					if(siret == '')
					{
						$("input[name='siret']").addClass('error');
						verif_form = false;
					}
					else
					{
						$("input[name='siret']").removeClass('error');
					}
					/////////////////////////
					if(company == '')
					{
						$("input[name='company']").addClass('error');
						verif_form = false;
					}
					else
					{
						$("input[name='siret']").removeClass('error');
					}
				}
				
				//si on a pas de véhicule
				if(verif_vehicule == false)
				{
					navigator.notification.alert("Merci de choisir au moins 1 véhicule", alertCallback, "Erreur véhicule", "Fermer");
					verif_form = false;
				}
				
				//on vérifie tous les autres champs
				if(nom == '')
				{
					$("input[name='nom']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='nom']").removeClass('error');
				}
				/////////////////////////
				if(prenom == '')
				{
					$("input[name='prenom']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='prenom']").removeClass('error');
				}
				/////////////////////////
				if(date_naissance == '')
				{
					$("input[name='date_naissance']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='date_naissance']").removeClass('error');
				}
				/////////////////////////
				if(pass == '')
				{
					$("input[name='pass']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='pass']").removeClass('error');
				}
				/////////////////////////
				if(pass_confirm == '')
				{
					$("input[name='pass_confirm']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='pass_confirm']").removeClass('error');
				}
				/////////////////////////
				if(email == '')
				{
					$("input[name='email']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='email']").removeClass('error');
				}
				/////////////////////////
				if(tel == '')
				{
					$("input[name='tel']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='tel']").removeClass('error');
				}
				/////////////////////////
				if(adresse == '')
				{
					$("input[name='adresse']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='adresse']").removeClass('error');
				}
				/////////////////////////
				if(ville == '')
				{
					navigator.notification.alert("Merci de préciser votre adresse en sélectionnant une suggestion", alertCallback, "Erreur adresse", "Fermer");
					$("input[name='adresse']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='adresse']").removeClass('error');
				}
				/////////////////////////
				if(statut == '')
				{
					$("input[name='statut']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='statut']").removeClass('error');
				}

				/**********************************************************************************/

				//si pas  derreur on envoie l'ajax
				if(verif_form == true)
				{
					$.ajax({
						url : 'http://www.colisclub.fr/application/ajax.php',
						type : 'GET', 
						data:'nom=' + nom +
							'&prenom=' + prenom +
							'&date_naissance=' + date_naissance +							
							'&pass=' + pass +							
							'&pass_confirm=' + pass_confirm +							
							'&email=' + email +							
							'&tel=' + tel +							
							'&adresse=' + adresse +							
							'&numero=' + numero +							
							'&rue=' + rue +							
							'&code_postal=' + code_postal +							
							'&ville=' + ville +							
							'&avatar=' + avatar +							
							'&presentation=' + presentation +							
							'&casier=' + casier +							
							'&statut=' + statut +							
							'&company=' + company +							
							'&siret=' + siret +							
							'&vehicules=' + vehicule_a_envoyer +							
							'&num_permis=' + num_permis +							
							'&permis=' + permis,						
						dataType : 'html',
						success: function (html) 
						{
							//si il y a une erreur avec le mot de passe
							if(html == 'Les mots de passe ne sont pas identiques !' || html == 'Votre mot de passe doit comporter au minimum 6 caracteres !')
							{
								$("html, body").animate({scrollTop: 0},"slow");
								navigator.notification.alert(html, alertCallback, "Erreur mot de passe", "Fermer");
								$("input[name='pass']").addClass('error');
								$("input[name='pass_confirm']").addClass('error');
							}
							else if (html == "dejainscrit")
							{
								$("html, body").animate({scrollTop: 0},"slow");
								navigator.notification.alert("l'email est déjà inscrit sur ce site merci de vous connecter", alertCallback, "Compte existant", "Fermer");
							}
							//sinon c est bon
							else if(html == 'reussite')
							{
								$('.inscription_validee').show('bind');
								$('.form_co_inscription').hide('bind');
							}
							else
							{
								alert('erreur inattendue' + html);
							}
						},
						error: function(resultat, statut, erreur) {
							$("html, body").animate({scrollTop: 0},"slow");
							alert('erreur');
						}
					});
				}
				else
				{
					navigator.notification.alert("Le formulaire comporte des erreurs", alertCallback, "Erreur inscription", "Fermer");
					$("html, body").animate({scrollTop: 0},"slow");
				}
			});
			/********************AJAX MOT DE PASSE PERDU ***********************/
			$("#password form").submit(function(e)
			{
				e.preventDefault();
				
				var email = $("input[name='mailpassforgot']").val();
				verif_form = true;

				if(email == '')
				{
					$("input[name='mailpassforgot']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='mailpassforgot']").removeClass('error');
				}
				
				if(verif_form == true)
				{
					$.ajax({
						url : 'http://www.colisclub.fr/application/ajax.php',
						type : 'GET', 
						data:'passforgot=1' +
						'&email=' + email,						
						dataType : 'html',
						success: function (html) 
						{
							// si il y a une erreur avec le mot de passe
							if(html == 'erreur_mail')
							{
								$("html, body").animate({scrollTop: 0},"slow");
								navigator.notification.alert("L'email n'est pas correct", alertCallback, "Erreur email", "Fermer");
								$("input[name='mailpassforgot']").addClass('error');
							}
							else if(html == 'erreur_compte')
							{
								$("html, body").animate({scrollTop: 0},"slow");
								navigator.notification.alert("L'email n'est pas connu sur notre base de données. Assurez vous d'avoir taper le bon email sinon veuillez vous inscrire", alertCallback, "Email inconnu", "Fermer");
								$("input[name='mailpassforgot']").addClass('error');
							}
							// sinon c est bon
							else if(html == 'reussite')
							{
								$('.pass_perdu').show('bind');
								$('.form_co_inscription').hide('bind');
							}
							else
							{
								alert('erreur inattendue' + html);
							}
						},
						error: function(resultat, statut, erreur) {
							$("html, body").animate({scrollTop: 0},"slow");
							alert('erreur');
						}
					});
				}
				else
				{
					navigator.notification.alert("Le formulaire comporte des erreurs", alertCallback, "Erreur inscription", "Fermer");
					$("html, body").animate({scrollTop: 0},"slow");
				}
			});
			/********************AJAX CONNEXION ***********************/
			$("#login form").submit(function(e)
			{
				e.preventDefault();
				
				var email = $("input[name='email_connec']").val();
				var pass = $("input[name='pass_connec']").val();
				verif_form = true;
				
				if(email == '')
				{
					$("input[name='email_connec']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='email_connec']").removeClass('error');
				}
				////////////////////////////
				if(pass == '')
				{
					$("input[name='pass_connec']").addClass('error');
					verif_form = false;
				}
				else
				{
					$("input[name='pass_connec']").removeClass('error');
				}
				
				if(verif_form == true)
				{
					$.ajax({
						url : 'http://www.colisclub.fr/application/ajax.php',
						type : 'GET', 
						data:'connec=1' +
						'&email=' + email +						
						'&pass=' + pass,						
						dataType : 'html',
						success: function (html) 
						{
							// si il y a une erreur avec le mot de passe
							if(html == 'erreur_valide')
							{
								navigator.notification.alert("Votre compte n'a pas été validé ! merci de cliquer sur le lien de validation dans le mail reçu lors de votre inscritpion", alertCallback, "Email non confirmé", "Fermer");
							}
							else if(html == 'erreur_pass')
							{
								navigator.notification.alert("Mot de passe incorrect !", alertCallback, "Erreur mot de passe", "Fermer");
							}
							else if(html == 'erreur_compte')
							{
								
								navigator.notification.alert("L'email n'est pas connu sur notre base de données. Assurez vous d'avoir taper le bon email sinon veuillez vous inscrire", alertCallback, "Email inconnu", "Fermer");
							}
							// sinon c est bon
							else
							{
								$('#interchangeable').html(html);
								load_connexion();
							}
								

						},
						error: function(resultat, statut, erreur) {
							$("html, body").animate({scrollTop: 0},"slow");
							alert('erreur');
						}
					});
				}
				else
				{
					navigator.notification.alert("Le formulaire comporte des erreurs", alertCallback, "Erreur inscription", "Fermer");
					$("html, body").animate({scrollTop: 0},"slow");
				}
				
			});
			
			/********************     AVATAR ***********************/
			$(".avatar").click(function()
			{
				// on remplit un input hidden pour le récuperer dans la fonction uploadphoto
				$("input[name='uploadphoto']").val('avatar'); 
				getImage();
			});
			$(".casier").click(function()
			{
				// on remplit un input hidden pour le récuperer dans la fonction uploadphoto
				$("input[name='uploadphoto']").val('casier'); 
				getImage();
			});
			$(".permis").click(function()
			{
				// on remplit un input hidden pour le récuperer dans la fonction uploadphoto
				$("input[name='uploadphoto']").val('permis'); 
				getImage();
			});
		});
		/********************************************************************/
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

/***************************** FONCTION UPLOAD PHOTO ***********************/
function getImage() 
{
	navigator.camera.getPicture(uploadPhoto, function(message) 
	{
		navigator.notification.alert("Aucune image chargée", alertCallback, "Échec", "Fermer");
	}, 
	{
		quality: 100,
		destinationType: navigator.camera.DestinationType.FILE_URI,
		sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
	});
}

function uploadPhoto(imageURI) 
{
	//on recupere qui doit etre charger
	quelle_photo = $("input[name='uploadphoto']").val();  //vaut soit : avatar/casier/permis
	
	var options = new FileUploadOptions();
	options.fileKey = quelle_photo;
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	console.log(options.fileName);
	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	options.params = params;
	options.chunkedMode = false;

	var ft = new FileTransfer();
	
	ft.upload(imageURI, "https://www.colisclub.fr/application/upload.php", function(result)
	{
		//console.log(JSON.stringify(result));
		// alert('ok: ' + result.response);
			
		//on remplace le contenu de la class "quelle_photo" par le contenu retourné
		$("." + quelle_photo).html(result.response);
	}, 
	function(error)
	{
		console.log(JSON.stringify(error));
		alert('KO');
	}, 
	options);
}
/**************************************************************************/
/***************************** GOOGLE AUTOCOMPLETE ***********************/
var placeSearch, autocomplete;
var componentForm = {
	street_number: 'short_name',
	route: 'long_name',
	locality: 'long_name',
	administrative_area_level_1: 'short_name',
	country: 'long_name',
	postal_code: 'short_name'
};

function initAutocomplete() 
{
	// Create the autocomplete object, restricting the search to geographical
	// location types.
	autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
		{types: ['geocode']});

	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() 
{
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();

	for (var component in componentForm) 
	{
		document.getElementById(component).value = '';
		document.getElementById(component).disabled = false;
	}

	// Get each component of the address from the place details
	// and fill the corresponding field on the form.
	for (var i = 0; i < place.address_components.length; i++) 
	{
		var addressType = place.address_components[i].types[0];
		
		if (componentForm[addressType]) 
		{
			var val = place.address_components[i][componentForm[addressType]];
			document.getElementById(addressType).value = val;
		}
	}
}
/**************************************************************************/
function formulaire_et_label()
{
	$('.form').find('input, textarea').on('keyup blur focus ready', function (e) 
	{  
		var $this = $(this),
		label = $this.prev('label');

		//cacher le label quand il ya  du texte
		if( $this.val() == '')
		{
			label.removeClass('cacher_label');
		}
		else
		{
			label.addClass('cacher_label');
		}
		
		if (e.type === 'keyup') 
		{
			if ($this.val() === '') 
			{
				label.removeClass('active highlight');
			} 
			else 
			{
				label.addClass('active highlight');
			}
		} 
		else if (e.type === 'blur') 
		{
			if( $this.val() === '' ) 
			{
				label.removeClass('active highlight'); 
			} 
			else 
			{
				label.removeClass('highlight');    
			}   
		} 
		else if (e.type === 'focus') 
		{
			if( $this.val() === '' ) 
			{
				label.removeClass('highlight'); 
			} 
			else if( $this.val() !== '' ) 
			{
				label.addClass('highlight');
			}
		}
	});
}

function alertCallback()
{
	//pour l'alert de cordova (obligatoire d avoir une fonction mais rien a y faire perso :) )
}
function load_connexion()
{
	function back_to_profil()
	{
		$(".menu_infos").show('blind');
	
		$(".update_infos").hide('blind');
		$(".update_mdp").hide('blind');
		$(".update_pay").hide('blind');
		$(".update_statut").hide('blind');
		$(".update_vehicules").hide('blind');
	}
	/**************menu mes informations************/
	$(".go_infos").click(function()
	{
		formulaire_et_label();
		$(".update_infos").show('blind');
		$(".menu_infos").hide('blind');
	});
	$(".go_securite").click(function()
	{
		formulaire_et_label();
		$(".update_mdp").show('blind');
		$(".menu_infos").hide('blind');
	});
	$(".go_paiement").click(function()
	{
		formulaire_et_label();
		$(".update_pay").show('blind');
		$(".menu_infos").hide('blind');
	});
	$(".go_statut").click(function()
	{
		formulaire_et_label();
		$(".update_statut").show('blind');
		$(".menu_infos").hide('blind');
	});
	$(".go_vehicules").click(function()
	{
		formulaire_et_label();
		$(".update_vehicules").show('blind');
		$(".menu_infos").hide('blind');
	});
	
	
	$(".back_profil").click(function()
	{
		back_to_profil();
	});
	
	/***************modifier infos ****************/
	$(".update_infos form").submit(function(e)
	{	
		e.preventDefault();
		verif_form = true;
		
		
		//verif des variables
		id_coursier = $("input[name='id_coursier']").val();
		nom = $("input[name='nom']").val();
		prenom = $("input[name='prenom']").val();
		date_naissance = $("input[name='date_naissance']").val();
		email = $("input[name='email']").val();
		tel = $("input[name='tel']").val();
		adresse = $("input[name='adresse']").val();
		// Adresse (autocomplete hidden) 
		numero = $("input#street_number").val();
		rue = $("input#route").val();
		code_postal = $("input#postal_code").val();
		ville = $("input#locality").val();
		
		//on vérifie tous les autres champs
		if(nom == '')
		{
			$("input[name='nom']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='nom']").removeClass('error');
		}
		/////////////////////////
		if(prenom == '')
		{
			$("input[name='prenom']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='prenom']").removeClass('error');
		}
		/////////////////////////
		if(date_naissance == '')
		{
			$("input[name='date_naissance']").addClass('error');
			verif_form = false;
		}
		/////////////////////////
		if(email == '')
		{
			$("input[name='email']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='email']").removeClass('error');
		}
		/////////////////////////
		if(tel == '')
		{
			$("input[name='tel']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='tel']").removeClass('error');
		}
		/////////////////////////
		if(adresse == '')
		{
			$("input[name='adresse']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='adresse']").removeClass('error');
		}
		/////////////////////////
		if(ville == '')
		{
			navigator.notification.alert("Merci de préciser votre adresse en sélectionnant une suggestion", alertCallback, "Erreur adresse", "Fermer");
			$("input[name='adresse']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='adresse']").removeClass('error');
		}
	
		if(verif_form == true)
		{
			//ajax
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'id_coursier=' + id_coursier +
					'&nom=' + nom + 
					'&prenom=' + prenom + 
					'&date_naissance=' + date_naissance + 
					'&email=' + email + 
					'&tel=' + tel + 
					'&numero=' + numero + 
					'&rue=' + rue + 
					'&code_postal=' + code_postal + 
					'&ville=' + ville,  
				dataType : 'html',
				success: function (html) 
				{
					if(html == 'reussite')
					{
						back_to_profil();
						$(".popup_confirm").show("bind");
						
						setTimeout(function()
						{ 
							$(".popup_confirm").hide("bind");
						}, 
						3000);
					}
					else
					{
						alert(html);
					}
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("le formulaire comporte des erreurs", alertCallback, "Erreur", "Fermer");
		}
	});
	/***************modifier mdp ****************/
	$(".update_mdp form").submit(function(e)
	{
		e.preventDefault();
		verif_form = true;
		
		//verif des variables
		id_coursier = $("input[name='id_coursier']").val();
		pass = $("input[name='pass']").val();
		new_pass = $("input[name='new_pass']").val();
		pass_confirm = $("input[name='pass_confirm']").val();
		
		if(pass == '')
		{
			$("input[name='pass']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='pass']").removeClass('error');
		}
		/////////////////////////
		if(new_pass == '')
		{
			$("input[name='new_pass']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='new_pass']").removeClass('error');
		}
		/////////////////////////
		if(pass_confirm == '')
		{
			$("input[name='pass_confirm']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("input[name='pass_confirm']").removeClass('error');
		}
		
		if(verif_form == true)
		{
			//ajax
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'id_coursier=' + id_coursier +
					'&pass=' + pass + 
					'&new_pass=' + new_pass + 
					'&pass_confirm=' + pass_confirm, 
				dataType : 'html',
				success: function (html) 
				{
					if(html == 'reussite')
					{
						back_to_profil();
						$(".popup_confirm").show("bind");
						
						setTimeout(function()
						{ 
							$(".popup_confirm").hide("bind");
						}, 
						3000);
					}
					else if(html == 'wrongpass')
					{
						navigator.notification.alert("Votre mot de passe est incorrect", alertCallback, "Erreur Mot de passe", "Fermer");
						$("input[name='pass']").addClass('error');
					}
					else if(html == 'Les mots de passe ne sont pas identiques !' || html == 'Votre mot de passe doit comporter au minimum 6 caracteres !')
					{
						$("html, body").animate({scrollTop: 0},"slow");
						navigator.notification.alert(html, alertCallback, "Erreur mot de passe", "Fermer");
						$("input[name='new_pass']").addClass('error');
						$("input[name='pass_confirm']").addClass('error');
					}
					else
					{
						alert(html);
					}
					
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("le formulaire comporte des erreurs", alertCallback, "Erreur", "Fermer");
		}
	});
	/***************modifier paiement ****************/
	$(".update_pay form").submit(function(e)
	{
		e.preventDefault();
		verif_form = true;
		
		//verif des variables
		id_coursier = $("input[name='id_coursier']").val();
		
		if(verif_form == true)
		{
			//ajax
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'var1=' + var1 +
					'&var2=' + var2 + 
					'&var3=' + var3, 
				dataType : 'html',
				success: function (html) 
				{
					
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("le formulaire comporte des erreurs", alertCallback, "Erreur", "Fermer");
		}
	});
	/***************modifier statut ****************/
	$(".update_statut form").submit(function(e)
	{
		e.preventDefault();
		verif_form = true;
		
		//verif des variables
		id_coursier = $("input[name='id_coursier']").val();
		statut = $("input[name='statut']").val();
		siret = $("input[name='siret']").val();
		company = $("input[name='company']").val();

		//si c ets pas un particulier il doit avoir renseigner son entreprise et son siret
		if(statut != "particulier")
		{
			if(siret == '')
			{
				$("input[name='siret']").addClass('error');
				verif_form = false;
			}
			else
			{
				$("input[name='siret']").removeClass('error');
			}
			/////////////////////////
			if(company == '')
			{
				$("input[name='company']").addClass('error');
				verif_form = false;
			}
			else
			{
				$("input[name='siret']").removeClass('error');
			}
		}
		
		if(verif_form == true)
		{
			//ajax
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'id_coursier=' + id_coursier +
					'&statut=' + statut + 
					'&siret=' + siret + 
					'&company=' + company, 
				dataType : 'html',
				success: function (html) 
				{
					if(html == 'reussite')
					{
						back_to_profil();
						$(".popup_confirm").show("bind");
						
						setTimeout(function()
						{ 
							$(".popup_confirm").hide("bind");
						}, 
						3000);
					}
					else
					{
						navigator.notification.alert("Une erreur est survenue merci de réésayer !", alertCallback, "Erreur", "Fermer");
					}
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("le formulaire comporte des erreurs", alertCallback, "Erreur", "Fermer");
		}
	});
	/***************modifier vehicules ****************/
	$(".update_vehicules form").submit(function(e)
	{
		e.preventDefault();
		verif_form = true;
		verif_vehicule = false;
		var verif_permis = false;
		vehicule_a_envoyer = '';

		//verif des variables
		id_coursier = $("input[name='id_coursier']").val();
		num_permis = $("input[name='num_permis']").val();
		permis = $("input[name='permis']").val();
		
		//on crée un tableau avec tous les vehicules (correpond aux id dans le html)
		var vehicules = [
		  "a_pied",
		  "velo",
		  "scooter",
		  "moto",
		  "voiture",
		  "fourgon",
		  "camion"
		];

		//on parcours le tableau pour verifier chaque checkbox
		$.each( vehicules, function( key, vehicule ) 
		{
			if( $("#" + vehicule).is(':checked'))
			{
				verif_vehicule = true;
				//on enregistre le véhicule dans la var a envoyer
				vehicule_a_envoyer += vehicule + '-';
				
				//si c est un vehicule motorise on cree une variable pour derriere verifier le permis 
				if(vehicule == 'scooter' || vehicule == 'moto' || vehicule == 'voiture' || vehicule == 'fourgon' || vehicule == 'camion')
				{
					verif_permis = true;
				}
			}
		});

		//si on doit verifier le permis
		if( verif_permis == true )
		{
			if(num_permis == '')
			{
				$("input[name='num_permis']").addClass('error');
				verif_form = false;
			}
			else
			{
				$("input[name='num_permis']").removeClass('error');
			}
			/////////////////////////
			if(permis == '')
			{
				navigator.notification.alert("Vous devez charger une photo de votre permis", alertCallback, "Erreur permis", "Fermer");
				verif_form = false;
			}
		}
		if(verif_vehicule == false)
		{
			navigator.notification.alert("Merci de choisir au moins 1 véhicule", alertCallback, "Erreur véhicule", "Fermer");
			verif_form = false;
		}

				
		if(verif_form == true)
		{
			//ajax
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'id_coursier=' + id_coursier +
					'&vehicule_a_envoyer=' + vehicule_a_envoyer + 
					'&num_permis=' + num_permis +
					'&permis=' + permis,
				dataType : 'html',
				success: function (html) 
				{
					if(html == 'reussite')
					{
						back_to_profil();
						$(".popup_confirm").show("bind");
						
						setTimeout(function()
						{ 
							$(".popup_confirm").hide("bind");
						}, 
						3000);
					}
					else
					{
						navigator.notification.alert("Une erreur est survenue merci de réésayer !", alertCallback, "Erreur", "Fermer");
						alert(html);
					}
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("le formulaire comporte des erreurs", alertCallback, "Erreur", "Fermer");
		}
	});
	/********************** MENU DU BAS *********************/
	$(".go_profil").click(function()
	{
		//on selectionne l icone en deselectionnant le reste
		$(".menu_fix_bas a").removeClass('selected');
		$(this).addClass('selected');
		
		//on charge le planning
		$(".mes_informations, .mon_planning, .courses_dispo, .mes_livraisons").hide();
		$(".mes_informations").show('blind');
		
		//on change le titre de la page
		$("p.titre_page").text("Mes informations");
		
	});
	$(".go_livraison").click(function()
	{
		//on selectionne l icone en deselectionnant le reste
		$(".menu_fix_bas a").removeClass('selected');
		$(this).addClass('selected');
		
		//on charge le planning
		$(".mes_informations, .mon_planning, .courses_dispo, .mes_livraisons").hide();
		$(".mes_livraisons").show('blind');
		
		//on change le titre de la page
		$("p.titre_page").text("Mes livraisons");
		
	});
	$(".go_map").click(function()
	{
		//on selectionne l icone en deselectionnant le reste
		$(".menu_fix_bas a").removeClass('selected');
		$(this).addClass('selected');
		
		//on charge le planning
		$(".mes_informations, .mon_planning, .courses_dispo, .mes_livraisons").hide();
		$(".courses_dispo").show('blind');
		
		//on change le titre de la page
		$("p.titre_page").text("Courses disponibles");
		
		/***************************************************/
		/**************         MAP      *******************/
		/***************************************************/
		$.ajax({
			url : 'http://www.colisclub.fr/application/ajax.php',
			type : 'GET', // Le type de la requête HTTP, ici devenu GET
			data:'load_map_init=1',
			dataType : 'html',
			success: function (html) 
			{
				$(".loader_map").html(html);
				// Get the current device location "without map"
				var option = {
					maximumAge: 10000,
					timeout: 10000,
					enableHighAccuracy: true // use GPS as much as possible
				};
				plugin.google.maps.LocationService.getMyLocation(option, function(location) 
				{
					// Create a map with the device location
					var mapDiv = document.getElementById('map_canvas');
					var map = plugin.google.maps.Map.getMap(mapDiv, 
					{
						'camera': 
						{
							target: location.latLng,
							zoom: 16
						}
					});

					map.addEventListener(plugin.google.maps.event.MAP_READY, function() 
					{
						// Add a marker
						var text = ["Current your location:\n",
						"latitude:" + location.latLng.lat.toFixed(3),
						"longitude:" + location.latLng.lng.toFixed(3),
						"speed:" + location.speed,
						"time:" + location.time,
						"bearing:" + location.bearing].join("\n");

						var marker = map.addMarker(
						{
							title: text,
							position: location.latLng,
							'icon': {url: 'img/pointer_livreur.png', size: { width: 30, height: 68 }}
						}, function(marker) 
						{
						  marker.showInfoWindow();
						});

						retourneMaPosition();
						
						/* AJAX */
						$.ajax({
							url : 'http://www.colisclub.fr/application/ajax.php',
							type : 'GET', // Le type de la requête HTTP, ici devenu POST
							data:'load_marker=1',
							dataType : 'json',
							success: function (html) 
							{
								html.forEach(function (mydata) 
								{
									map.addMarker({
										position: mydata.position,
										title: mydata.title,
										'icon': mydata.icon
									  }, function(marker) {
										// Show the infoWindow
										marker.on(plugin.google.maps.event.MARKER_CLICK, function() 
										{
											var id_course = marker.getTitle();//on y mettra l id
											
											//animation
											marker.setAnimation(plugin.google.maps.Animation.BOUNCE);
											
											//on cahrge la fenetre de la course
											$.ajax({
												url : 'http://www.colisclub.fr/application/ajax.php',
												type : 'GET', 
												data:'affiche_course=1' + 
													'&id_course=' + id_course, 
												dataType : 'html',
												success: function (html) 
												{
													$(".top_courses_dispo").html(html);
													
													$(".accept_course").click(function()
													{
														alert('ca marche');
														var id_course = $(this).attr("data-course");
														var id_coursier = $("input[name='id_coursier']").val();
														//$("input[name='acceptation_course']").val( id_course );
														
														/* AJAX */
														$.ajax({
															url : 'http://www.colisclub.fr/application/ajax.php',
															type : 'GET', // Le type de la requête HTTP, ici devenu POST
															data:'accept_course=' + id_course +
																'&coursier=' + id_coursier, 
															dataType : 'html',
															success: function (html) 
															{
																$(".top_courses_dispo").hide();
																marker.remove();
																if(html == 'DEJAPRIS')
																{
																	navigator.notification.alert("Désolé mais la course n'est plus disponible ! Un autre coursier semble déjà avoir acceptée cette livraison. Il doit y en avoir une autre a proximité !", alertCallback, "Course refusée", "Fermer");
																}
																else if(html == 'REUSSITE')
																{
																	navigator.notification.alert("La course a été acceptée, elle apparait désormait dans vos livraisons a effectuée !", alertCallback, "Course acceptée", "Fermer");
																}
																else
																{
																	alert('la: ' + html);
																}
																
															},
															error: function(resultat, statut, erreur) {
																navigator.notification.alert("erreur", alertCallback, "accepter la course", "Fermer");
															}
														});
													});
												},
												error: function(resultat, statut, erreur) {
													alert('erreur');
												}
											});
											$(".infos_livraisons").show();
										});
									  });
								});
							},
							error: function(resultat, statut, erreur) {
								alert('erreur');
							}
						});
											
						
					});
				});
				function onSuccess(position) 
				{
					var lat = position.coords.latitude;//latitude actuelle
					var longi = position.coords.longitude;//longitude actuelle
				
					$.ajax({
						url : 'http://www.colisclub.fr/application/ajax.php',
						type : 'GET', // Le type de la requête HTTP, ici devenu POST
						data:'lat=' + lat +
							'&longi=' + longi,
						dataType : 'html',
						success: function (html) 
						{
							alert("position enregistrée");
						},
						error: function(resultat, statut, erreur) 
						{
							navigator.notification.alert("erreur", alertCallback, "Géolocalisation", "Fermer");
						}
					});		
				}

				// onError Callback receives a PositionError object
				function onError(error) {
					alert('code: '    + error.code    + '\n' +
						  'message: ' + error.message + '\n');
				}
				
				function alertCallback()
				{
					//pour l'alert de cordova (obligatoire d avoir une fonction mais rien a y faire perso :) )
				}
				
				function retourneMaPosition()
				{
					setTimeout(function()
					{
						navigator.geolocation.getCurrentPosition(onSuccess, onError);
						retourneMaPosition();
					}
					, 240000);
				}
			},
			error: function(resultat, statut, erreur) 
			{
				navigator.notification.alert("erreur", alertCallback, "Géolocalisation", "Fermer");
			}
		});	
		/***************************************************/
		/***************************************************/
		
	});
	
	/************* ACCEPTATION DE LIVRAISON ****************/
	/*$("input[name='acceptation_course']").change(function()
	{
		var id_course = $(this).val(); //on récupere l id de la course
		var id_coursier = $("input[name='id_coursier']").val(); //on récupere l id de la course
		
		
	});*/
	/*******************************************************/
	
	$(".go_to_bank_account").click(function()
	{
		var key = $(this).attr('data-key');
		var coursier = $(this).attr('data-coursier');
		cordova.InAppBrowser.open('https://www.colisclub.fr/espace-coursier/compte-bancaire.php?key=' + key + '&coursier=' + coursier, '_blank', 'location=no');
	});
	
	/********************** PAGE LIVRAISON *********************/
	
	//J'ouvre la popup pour entrer un code sur la feuille de route d'un coursier 
	$(".valide_etape_code").click(function()
	{
		var suivi = $(this).attr("data-suivi"); // vaut soit go/enlevement/livraison
		var id_livraison = $(this).attr("data-livraison"); // vaut soit go/enlevement/livraison

		if(suivi == 'nothing')
		{
			next_step = "enlevement";
			next_btn = "J'ai le colis";
			
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'livraison=' + id_livraison +
					'&code=' + 'aucun' + 
					'&suivi=' + suivi, // vaut soit go/enlevement/livraison
				dataType : 'html',
				success: function (html) 
				{
					navigator.notification.alert(html, alertCallback, "Suvi", "Fermer");
					
					$(".popup_code").hide('blind');
					$(".commande_" + id_livraison + " .valide_etape_code").text( next_btn );
					$(".commande_" + id_livraison + " .valide_etape_code").attr( "data-suivi", next_step );
				
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			$(".popup_code").show('blind');
			$("input[name='suivi']").val( suivi );
			$("input[name='id_livraison']").val( id_livraison );
		}
	});
	
	/**** FERME LA POPUP *******/
	$(".popup_code i.close").click(function()
	{
		$(".popup_code").hide('blind');
	});
	
	/*************** SOUMISSION DU CODE EXP OU DEST *****************/
	$("form#suvi_livraison").submit(function(e)
	{
		e.preventDefault();
		
		verif_form = true;
		var code = $("form#suvi_livraison input[name='code']").val();
		var suivi = $("form#suvi_livraison input[name='suivi']").val(); // vaut soit go/enlevement/livraison
		var id_livraison = $("form#suvi_livraison input[name='id_livraison']").val();
		
		if(suivi == 'enlevement')
		{
			next_step = "livraison";
			next_btn = "Le colis est livré";
			qui = "l'expéditeur";
		}
		else if(suivi == 'livraison')
		{
			next_step = "livre";
			next_btn = "Commande terminée";
			qui = 'le destinataire';
		}
		
		if(code == '')
		{
			$("form#suvi_livraison input[name='code']").addClass('error');
			verif_form = false;
		}
		else
		{
			$("form#suvi_livraison input[name='code']").removeClass('error');
		}
		
		if(verif_form == true)
		{
			$.ajax({
				url : 'http://www.colisclub.fr/application/ajax.php',
				type : 'GET', // Le type de la requête HTTP, ici devenu POST
				data:'livraison=' + id_livraison +
					'&code=' + code + 
					'&suivi=' + suivi, // vaut soit go/enlevement/livraison
				dataType : 'html',
				success: function (html) 
				{
					navigator.notification.alert(html, alertCallback, "Avancée du Suivi", "Fermer");
					
					if(html == "Le code est incorrect")
					{
						$("input[name='code']").addClass('error');
					}
					else
					{
						$("input[name='code']").val('');
						$(".popup_code").hide('blind');
						$(".commande_" + id_livraison + " .valide_etape_code").text( next_btn );
						$(".commande_" + id_livraison + " .valide_etape_code").attr( "data-suivi", next_step );
						
						if(next_step == "livre")
						{
							$(".commande_" + id_livraison).hide('blind');
							nb_commandes_restantes = parseInt( $("p.commande span").html() );
							nb_commandes_restantes = nb_commandes_restantes - 1;
							$("p.commande span").html(nb_commandes_restantes);
						}
					}
				},
				error: function(resultat, statut, erreur) 
				{
					navigator.notification.alert("Une erreur est survenue merci de réésayer ! ", alertCallback, "Erreur", "Fermer");
				}
			});
		}
		else
		{
			navigator.notification.alert("Merci de remplir le code fournit par " + qui, alertCallback, "Erreur", "Fermer");
		}
	});
}

