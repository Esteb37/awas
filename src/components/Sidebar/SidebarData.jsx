import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as CgIcons from 'react-icons/cg';

export const SidebarData = [
	{
		title: 'Inicio',
		path: '/',
		icon: <AiIcons.AiFillHome />,
		cname: 'nav-text',
	},
	{
		title: 'Mi estado',
		path: '/profile',
		icon: <CgIcons.CgProfile />,
		cname: 'nav-text',
	},
	{
		title: 'Mis amigos',
		path: '/friends',
		icon: <FaIcons.FaUserFriends />,
		cname: 'nav-text',
	},

	{
		title: 'FAQ',
		path: '/faq',
		icon: <FaIcons.FaQuestionCircle />,
		cname: 'nav-text',
	},
];
