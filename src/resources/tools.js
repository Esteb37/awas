export const distance = (pos1, pos2) => {
	const R = 6371e3; // metres
	const radlat1 = (pos1._lat * Math.PI) / 180; // φ, λ in radians
	const radlat2 = (pos2._lat * Math.PI) / 180;
	const radtheta = ((pos2._lat - pos1._lat) * Math.PI) / 180;
	const theta = ((pos2._long - pos1._long) * Math.PI) / 180;

	const a =
		Math.sin(radtheta / 2) * Math.sin(radtheta / 2) +
		Math.cos(radlat1) *
			Math.cos(radlat2) *
			Math.sin(theta / 2) *
			Math.sin(theta / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return (c * R) / 1000;
};
