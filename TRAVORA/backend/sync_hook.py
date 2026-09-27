import os
import sys

def auto_sync_database_views():
    """
    Automatically re-generates DATABASE_VIEW.md and DATABASE_VIEW.html
    so that project database table files always mirror the live SQLite data.
    """
    try:
        from export_database_view import generate_database_views
        generate_database_views()
    except Exception as e:
        print(f"Warning: Failed to auto-sync database views: {e}")
