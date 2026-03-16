from database import db
import asyncio
import logging

logger = logging.getLogger(__name__)

# Deployed contract addresses on Blokista Mainnet
CONTRACT_ADDRESSES = {
    "WBCC": "0x0Ed138DaB3f9beEfeA779Af0b62fB3b2A220C4bc",
    "FACTORY": "0xf29787D28e9B2B94ce8bdAbF8f768eaaDb29234b",
    "ROUTER": "0x07683f7Fb2Aa99fE4094b87baBd2bc254f19b270",
    "PAIR": "0xaDb89D867a5962cC6494865CfE4f20AA52AaDe40",
    "USDT": "0x0000000000000000000000000000000000000000"
}

# Initial token data for Blokista network
INITIAL_TOKENS = [
    {
        "id": "bcc",
        "symbol": "BCC",
        "name": "Blokista",
        "address": "0x0000000000000000000000000000000000000000",  # Native token
        "decimals": 18,
        "logo": "https://api.dicebear.com/7.x/shapes/svg?seed=bcc&backgroundColor=DAA520",
        "price": 2.45,
        "price_change_24h": 3.24,
        "is_native": True
    },
    {
        "id": "wbcc",
        "symbol": "WBCC",
        "name": "Wrapped BCC",
        "address": "0x0Ed138DaB3f9beEfeA779Af0b62fB3b2A220C4bc",
        "decimals": 18,
        "logo": "https://api.dicebear.com/7.x/shapes/svg?seed=wbcc&backgroundColor=B8860B",
        "price": 2.45,
        "price_change_24h": 3.24,
        "is_native": False
    },
    {
        "id": "usdt",
        "symbol": "USDT",
        "name": "Tether USD",
        "address": "0x0000000000000000000000000000000000000001",
        "decimals": 18,
        "logo": "https://api.dicebear.com/7.x/shapes/svg?seed=usdt&backgroundColor=26A17B",
        "price": 1.00,
        "price_change_24h": 0.01,
        "is_native": False
    }
]

# Initial pool data - WBCC/USDT pool
INITIAL_POOLS = [
    {
        "id": "pool1",
        "token0_address": "0x0Ed138DaB3f9beEfeA779Af0b62fB3b2A220C4bc",  # WBCC
        "token1_address": "0x0000000000000000000000000000000000000001",  # USDT placeholder
        "pair_address": "0xaDb89D867a5962cC6494865CfE4f20AA52AaDe40",
        "fee": 0.3,
        "tvl": 0,
        "volume_24h": 0,
        "apr": 0,
        "token0_reserve": 0,
        "token1_reserve": 0
    }
]

# Initial stats
INITIAL_STATS = {
    "total_volume": 0,
    "tvl": 0,
    "total_swappers": 0,
    "volume_24h": 0,
    "transactions_24h": 0,
    "active_pools": 1
}


async def seed_database():
    """Seed the database with initial data"""
    try:
        # Check if already seeded
        existing_tokens = await db.tokens.count_documents({})
        if existing_tokens > 0:
            logger.info("Database already seeded, skipping...")
            return
        
        logger.info("Seeding database with initial data...")
        
        # Insert tokens
        await db.tokens.insert_many(INITIAL_TOKENS)
        logger.info(f"Inserted {len(INITIAL_TOKENS)} tokens")
        
        # Insert pools
        await db.pools.insert_many(INITIAL_POOLS)
        logger.info(f"Inserted {len(INITIAL_POOLS)} pools")
        
        # Insert stats
        await db.stats.insert_one(INITIAL_STATS)
        logger.info("Inserted initial stats")
        
        # Create indexes
        await db.tokens.create_index("address", unique=True)
        await db.tokens.create_index("symbol")
        await db.pools.create_index("id", unique=True)
        await db.pools.create_index([("token0_address", 1), ("token1_address", 1)])
        await db.positions.create_index("wallet_address")
        await db.positions.create_index("pool_id")
        await db.transactions.create_index("wallet_address")
        await db.transactions.create_index("timestamp")
        
        logger.info("Database seeding complete!")
        
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise


async def reset_and_seed():
    """Drop existing data and reseed with new addresses"""
    try:
        logger.info("Resetting database with Blokista contract addresses...")
        
        # Drop existing collections
        await db.tokens.drop()
        await db.pools.drop()
        await db.stats.drop()
        
        # Insert new data
        await db.tokens.insert_many(INITIAL_TOKENS)
        logger.info(f"Inserted {len(INITIAL_TOKENS)} tokens")
        
        await db.pools.insert_many(INITIAL_POOLS)
        logger.info(f"Inserted {len(INITIAL_POOLS)} pools")
        
        await db.stats.insert_one(INITIAL_STATS)
        logger.info("Inserted initial stats")
        
        # Recreate indexes
        await db.tokens.create_index("address", unique=True)
        await db.tokens.create_index("symbol")
        await db.pools.create_index("id", unique=True)
        await db.pools.create_index([("token0_address", 1), ("token1_address", 1)])
        
        logger.info("Database reset complete with Blokista contract addresses!")
        
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        raise


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--reset":
        asyncio.run(reset_and_seed())
    else:
        asyncio.run(seed_database())
