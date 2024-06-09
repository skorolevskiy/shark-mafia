import * as kysely from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'
import { sql } from '@vercel/postgres'

export interface PlayersTable {
	id: kysely.Generated<number>
	fid: string | null
	username: string | null
	createdAt: kysely.ColumnType<Date, string | undefined, never>
	wallet: string | null
    powerBadge: boolean
}

// Keys of this interface are table names.
export interface Database {
	sharks: PlayersTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'

export async function getUser(fid: string | null): Promise<any> {
	let data: any;

	try {
		data = await db
			.selectFrom('sharks')
			.where('fid', '=', fid)
			.selectAll()
			.executeTakeFirst();
		return data; // Data fetched successfully
	} catch (e: any) {
		if (e.message.includes('relation "spiners" does not exist')) {
			console.warn(
				'Table does not exist, creating and seeding it with dummy data now...'
			);
			// Table is not created yet
			//await seed();
			return false; // Data fetched successfully after seeding
		} else {
			console.error('Error fetching data:', e);
			return false; // Error occurred while fetching data
		}
	}
}

export async function addUser(fid: string | null, username: string | null, wallet: string | null, power_badge: boolean) {

	const result = await db
		.insertInto('sharks')
		.values({
			fid: fid ? fid : null,
			username: username ? username : null,
            wallet: wallet,
            powerBadge: power_badge
		})
		.executeTakeFirst()
}