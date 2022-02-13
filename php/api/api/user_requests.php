<?php
class UsersRequests
{
	protected $user = null;
	protected $Connect;

	function __construct(Users $user, DB $Connect, SystemNotifications $SYSNotif)
	{
		$this->user = $user;
		$this->Connect = $Connect;
		$this->SYSNOTIF = $SYSNotif;
	}