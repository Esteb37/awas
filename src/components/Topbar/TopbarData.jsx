import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as CgIcons from 'react-icons/cg';
import * as FaIcons from 'react-icons/fa';

export const TopbarData = [
	{
		title: 'Servicios',
		path: '/',
		icon: <FiIcons.FiScissors />,
		cname: 'topbar-item topbar-item-4',
		id: 'services',
	},
	{
		title: 'Barberos',
		path: '/barbers',
		icon: <GiIcons.GiMustache />,
		cname: 'topbar-item topbar-item-4',
		id: 'barbers',
	},
	{
		title: 'Contacto',
		path: '/contact',
		icon: <AiIcons.AiOutlinePhone />,
		cname: 'topbar-item topbar-item-4',
		id: 'contact',
	},
	{
		title: 'Cómo llegar',
		path: '/map',
		icon: <BiIcons.BiMap />,
		cname: 'topbar-item topbar-item-4',
		id: 'map',
	},
];

export const TopbarAppointmentsData = [
	{
		title: 'Hoy',
		path: '/appointments/today',
		icon: <CgIcons.CgCalendarDue />,
		cname: 'topbar-item topbar-item-3',
		id: 'today',
	},
	{
		title: 'Siguientes',
		path: '/appointments/next',
		icon: <CgIcons.CgCalendarNext />,
		cname: 'topbar-item topbar-item-3',
		id: 'next',
	},
	{
		title: 'Historial',
		path: '/appointments/history',
		icon: <FaIcons.FaHistory />,
		cname: 'topbar-item topbar-item-3',
		id: 'history',
	},
];
